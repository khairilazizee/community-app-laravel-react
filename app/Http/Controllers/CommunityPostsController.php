<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
use App\Models\PostTag;
use App\Models\PostsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CommunityPostsController extends Controller
{
    use CommunityAccess;

    public function index(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $query = PostsModel::where('community_id', $community->id)->latest();
        if ($member->role !== CommunityMemberRole::Admin) {
            $query->where('user_id', Auth::id());
        }

        return Inertia::render('communities/posts/index', [
            'community' => $community,
            'posts' => $query->get(),
            'can_approve' => $member->role === CommunityMemberRole::Admin,
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        return Inertia::render('communities/posts/create', [
            'community' => $community,
        ]);
    }

    public function edit(int $communityId, int $postId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $post = PostsModel::where('community_id', $community->id)
            ->with('tags')
            ->findOrFail($postId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $post->user_id === Auth::id();

        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('communities/posts/edit', [
            'community' => $community,
            'post' => $post,
            'can_approve' => $isAdmin,
        ]);
    }

    public function show(string $communitySlug, string $slug)
    {
        $community = CommunitiesModel::where('slug', $communitySlug)->firstOrFail();

        if ($community->is_private) {
            if (!Auth::check()) {
                abort(404);
            }

            $member = $community->members()
                ->where('user_id', Auth::id())
                ->where('status', CommunityMemberStatus::Active)
                ->first();

            if (!$member) {
                abort(404);
            }
        }

        $post = PostsModel::where('community_id', $community->id)
            ->with('tags')
            ->where('slug', $slug)
            ->first();

        if (!$post && ctype_digit($slug)) {
            $post = PostsModel::where('community_id', $community->id)
                ->where('id', (int) $slug)
                ->firstOrFail();
        }

        if (!$post) {
            abort(404);
        }

        $isAdmin = false;
        $isOwner = false;
        if (Auth::check()) {
            $member = $community->members()
                ->where('user_id', Auth::id())
                ->where('status', CommunityMemberStatus::Active)
                ->first();
            $isAdmin = $member?->role === CommunityMemberRole::Admin;
            $isOwner = $post->user_id === Auth::id();
        }

        if (
            (!$post->is_active || $post->approval_status !== 'approved') &&
            !$isAdmin &&
            !$isOwner
        ) {
            abort(404);
        }

        return Inertia::render('communities/posts/show', [
            'community' => $community,
            'post' => $post,
            'can_approve' => $isAdmin,
        ]);
    }

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireMember($community);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'nullable|string|max:50',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'tags' => 'nullable|string',
        ]);

        $slug = $this->generateSlug($community->id, $data['title']);

        $approvalStatus = $member->role === CommunityMemberRole::Admin
            ? 'approved'
            : 'pending';

        $post = PostsModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'slug' => $slug,
            'content' => $data['content'],
            'type' => $data['type'] ?? 'announcement',
            'published_at' => $data['published_at'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'approval_status' => $approvalStatus,
            'approved_by' => $approvalStatus === 'approved' ? Auth::id() : null,
            'approved_at' => $approvalStatus === 'approved' ? now() : null,
        ]);

        $this->syncPostTags($post, $community, $data['tags'] ?? null);

        return back()->with('status', 'Post created successfully.');
    }

    public function update(Request $request, int $communityId, int $postId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $post = PostsModel::where('community_id', $community->id)->findOrFail($postId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $post->user_id === Auth::id();
        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }

        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'nullable|string|max:50',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'tags' => 'nullable|string',
        ];
        if ($isAdmin) {
            $rules['approval_status'] = 'nullable|string|in:pending,approved,rejected';
        }

        $data = $request->validate($rules);

        $slug = $post->title !== $data['title']
            ? $this->generateSlug($community->id, $data['title'], $post->id)
            : $post->slug;
        $post->fill([
            'title' => $data['title'],
            'slug' => $slug,
            'content' => $data['content'],
            'type' => $data['type'] ?? $post->type,
            'published_at' => $data['published_at'] ?? null,
            'is_active' => $data['is_active'] ?? $post->is_active,
        ]);

        if ($isAdmin) {
            if (!empty($data['approval_status'])) {
                $post->approval_status = $data['approval_status'];
                if ($data['approval_status'] === 'approved') {
                    $post->approved_by = Auth::id();
                    $post->approved_at = now();
                    if (!$post->published_at) {
                        $post->published_at = now();
                    }
                }
            }
        } else {
            $post->approval_status = 'pending';
            $post->approved_by = null;
            $post->approved_at = null;
        }
        $post->save();

        $this->syncPostTags($post, $community, $data['tags'] ?? null);

        return back()->with('status', 'Post updated successfully.');
    }

    public function delete(int $communityId, int $postId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $post = PostsModel::where('community_id', $community->id)->findOrFail($postId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $post->user_id === Auth::id();
        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }
        $post->delete();

        return back()->with('status', 'Post deleted successfully.');
    }

    private function generateSlug(int $communityId, string $title, ?int $ignoreId = null): string
    {
        $base = Str::slug($title);
        $slug = $base !== '' ? $base : Str::random(8);
        $counter = 1;

        while ($this->slugExists($communityId, $slug, $ignoreId)) {
            $slug = $base . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    private function slugExists(int $communityId, string $slug, ?int $ignoreId = null): bool
    {
        $query = PostsModel::where('community_id', $communityId)->where('slug', $slug);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    private function syncPostTags(
        PostsModel $post,
        CommunitiesModel $community,
        ?string $tagsInput,
    ): void {
        if (is_null($tagsInput)) {
            return;
        }

        $tags = array_filter(array_map(function ($tag) {
            return trim($tag);
        }, explode(',', $tagsInput)));

        if (!$tags) {
            $post->tags()->detach();
            return;
        }

        $tagIds = [];
        foreach ($tags as $tagName) {
            $tagIds[] = PostTag::firstOrCreate([
                'community_id' => $community->id,
                'name' => $tagName,
            ])->id;
        }

        $post->tags()->sync($tagIds);
    }
}
