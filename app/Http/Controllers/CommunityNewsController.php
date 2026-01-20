<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
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
        $this->requireAdmin($community);

        return Inertia::render('communities/news/index', [
            'community' => $community,
            'news' => NewsModel::where('community_id', $community->id)->latest()->get(),
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        return Inertia::render('communities/news/create', [
            'community' => $community,
        ]);
    }

    public function edit(int $communityId, int $newsId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $news = NewsModel::where('community_id', $community->id)->findOrFail($newsId);

        return Inertia::render('communities/news/edit', [
            'community' => $community,
            'news' => $news,
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

        return Inertia::render('communities/news/show', [
            'community' => $community,
            'news' => $news,
        ]);
    }

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $slug = $this->generateSlug($community->id, $data['title']);

        NewsModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::id(),
            'title' => $data['title'],
            'slug' => $slug,
            'content' => $data['content'],
            'published_at' => $data['published_at'] ?? null,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return back()->with('status', 'News created successfully.');
    }

    public function update(Request $request, int $communityId, int $newsId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'published_at' => 'nullable|date',
            'is_active' => 'nullable|boolean',
        ]);

        $news = NewsModel::where('community_id', $community->id)->findOrFail($newsId);
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
        $news->save();

        return back()->with('status', 'News updated successfully.');
    }

    public function delete(int $communityId, int $newsId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $news = NewsModel::where('community_id', $community->id)->findOrFail($newsId);
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
}
