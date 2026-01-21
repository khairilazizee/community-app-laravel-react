<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
use App\Models\NewsTag;
use App\Models\NewsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CommunityNewsController extends Controller
{
    use CommunityAccess;

    public function index(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $query = NewsModel::where('community_id', $community->id)->latest();
        if ($member->role !== CommunityMemberRole::Admin) {
            $query->where('user_id', Auth::id());
        }

        return Inertia::render('communities/news/index', [
            'community' => $community,
            'news' => $query->get(),
            'can_approve' => $member->role === CommunityMemberRole::Admin,
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        return Inertia::render('communities/news/create', [
            'community' => $community,
        ]);
    }

    public function edit(int $communityId, int $newsId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $news = NewsModel::where('community_id', $community->id)
            ->with('tags')
            ->findOrFail($newsId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $news->user_id === Auth::id();

        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }

        return Inertia::render('communities/news/edit', [
            'community' => $community,
            'news' => $news,
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

        $news = NewsModel::where('community_id', $community->id)
            ->with('tags')
            ->where('slug', $slug)
            ->first();

        if (!$news && ctype_digit($slug)) {
            $news = NewsModel::where('community_id', $community->id)
                ->where('id', (int) $slug)
                ->firstOrFail();
        }

        if (!$news) {
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
            $isOwner = $news->user_id === Auth::id();
        }

        if (
            (!$news->is_active || $news->approval_status !== 'approved') &&
            !$isAdmin &&
            !$isOwner
        ) {
            abort(404);
        }

        return Inertia::render('communities/news/show', [
            'community' => $community,
            'news' => $news,
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
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'tags' => 'nullable|string',
        ]);

        $slug = $this->generateSlug($community->id, $data['title']);

        $approvalStatus = $member->role === CommunityMemberRole::Admin
            ? 'approved'
            : 'pending';

        $news = NewsModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'slug' => $slug,
            'content' => $data['content'],
            'published_at' => $data['published_at'] ?? null,
            'is_active' => $data['is_active'] ?? true,
            'approval_status' => $approvalStatus,
            'approved_by' => $approvalStatus === 'approved' ? Auth::id() : null,
            'approved_at' => $approvalStatus === 'approved' ? now() : null,
        ]);

        $this->syncNewsTags($news, $community, $data['tags'] ?? null);

        return back()->with('status', 'News created successfully.');
    }

    public function update(Request $request, int $communityId, int $newsId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $news = NewsModel::where('community_id', $community->id)->findOrFail($newsId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $news->user_id === Auth::id();
        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }

        $rules = [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
            'tags' => 'nullable|string',
        ];
        if ($isAdmin) {
            $rules['approval_status'] = 'nullable|string|in:pending,approved,rejected';
        }

        $data = $request->validate($rules);

        $slug = $news->title !== $data['title']
            ? $this->generateSlug($community->id, $data['title'], $news->id)
            : $news->slug;
        $news->fill([
            'title' => $data['title'],
            'slug' => $slug,
            'content' => $data['content'],
            'published_at' => $data['published_at'] ?? null,
            'is_active' => $data['is_active'] ?? $news->is_active,
        ]);
        if ($isAdmin) {
            if (!empty($data['approval_status'])) {
                $news->approval_status = $data['approval_status'];
                if ($data['approval_status'] === 'approved') {
                    $news->approved_by = Auth::id();
                    $news->approved_at = now();
                    if (!$news->published_at) {
                        $news->published_at = now();
                    }
                }
            }
        } else {
            $news->approval_status = 'pending';
            $news->approved_by = null;
            $news->approved_at = null;
        }
        $news->save();

        $this->syncNewsTags($news, $community, $data['tags'] ?? null);

        return back()->with('status', 'News updated successfully.');
    }

    public function delete(int $communityId, int $newsId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $news = NewsModel::where('community_id', $community->id)->findOrFail($newsId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $news->user_id === Auth::id();
        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }
        $news->delete();

        return back()->with('status', 'News deleted successfully.');
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
        $query = NewsModel::where('community_id', $communityId)->where('slug', $slug);
        if ($ignoreId) {
            $query->where('id', '!=', $ignoreId);
        }

        return $query->exists();
    }

    private function syncNewsTags(
        NewsModel $news,
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
            $news->tags()->detach();
            return;
        }

        $tagIds = [];
        foreach ($tags as $tagName) {
            $tagIds[] = NewsTag::firstOrCreate([
                'community_id' => $community->id,
                'name' => $tagName,
            ])->id;
        }

        $news->tags()->sync($tagIds);
    }
}
