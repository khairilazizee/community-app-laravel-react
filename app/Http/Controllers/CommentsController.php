<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\BusinessesModel;
use App\Models\CommentsModel;
use App\Models\CommunitiesModel;
use App\Models\NewsModel;
use App\Models\PostsModel;
use App\Models\ServicesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommentsController extends Controller
{
    use CommunityAccess;

    public function store(Request $request)
    {
        $data = $request->validate([
            'commentable_type' => 'required|string|in:post,news,business,service',
            'commentable_id' => 'required|integer',
            'content' => 'required|string',
        ]);

        $commentable = $this->resolveCommentable($data['commentable_type'], $data['commentable_id']);
        $community = CommunitiesModel::findOrFail($commentable->community_id);
        $this->requireMember($community);

        CommentsModel::create([
            'user_id' => Auth::id(),
            'commentable_type' => $commentable::class,
            'commentable_id' => $commentable->id,
            'content' => $data['content'],
        ]);

        return back()->with('status', 'Comment added successfully.');
    }

    public function delete(int $commentId)
    {
        $comment = CommentsModel::findOrFail($commentId);
        if ($comment->user_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $comment->delete();

        return back()->with('status', 'Comment deleted successfully.');
    }

    private function resolveCommentable(string $type, int $id)
    {
        return match ($type) {
            'post' => PostsModel::findOrFail($id),
            'news' => NewsModel::findOrFail($id),
            'business' => BusinessesModel::findOrFail($id),
            'service' => ServicesModel::findOrFail($id),
        };
    }
}
