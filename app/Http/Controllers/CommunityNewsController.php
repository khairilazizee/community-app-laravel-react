<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\CommunitiesModel;
use App\Models\NewsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommunityNewsController extends Controller
{
    use CommunityAccess;

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

        NewsModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::id(),
            'title' => $data['title'],
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
        $news->fill([
            'title' => $data['title'],
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
}
