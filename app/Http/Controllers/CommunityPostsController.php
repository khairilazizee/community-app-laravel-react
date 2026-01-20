<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
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
        $this->requireAdmin($community);

        return Inertia::render('communities/posts/index', [
            'community' => $community,
            'posts' => PostsModel::where('community_id', $community->id)->latest()->get(),
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        return Inertia::render('communities/posts/create', [
            'community' => $community,
        ]);
    }

    public function edit(int $communityId, int $postId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $post = PostsModel::where('community_id', $community->id)->findOrFail($postId);

        return Inertia::render('communities/posts/edit', [
            'community' => $community,
            'post' => $post,
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

        return Inertia::render('communities/posts/show', [
            'community' => $community,
            'post' => $post,
        ]);
    }

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'nullable|string|max:50',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $slug = $this->generateSlug($community->id, $data['title']);

        PostsModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'slug' => $slug,
            'content' => $data['content'],
            'type' => $data['type'] ?? 'announcement',
            'published_at' => $data['published_at'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return back()->with('status', 'Post created successfully.');
    }

    public function update(Request $request, int $communityId, int $postId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'nullable|string|max:50',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $post = PostsModel::where('community_id', $community->id)->findOrFail($postId);
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
        $post->save();

        return back()->with('status', 'Post updated successfully.');
    }

    public function delete(int $communityId, int $postId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $post = PostsModel::where('community_id', $community->id)->findOrFail($postId);
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
}
