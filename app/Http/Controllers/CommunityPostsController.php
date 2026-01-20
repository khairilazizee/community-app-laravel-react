<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\CommunitiesModel;
use App\Models\PostsModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommunityPostsController extends Controller
{
    use CommunityAccess;

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

        PostsModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::id(),
            'title' => $data['title'],
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
        $post->fill([
            'title' => $data['title'],
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
}
