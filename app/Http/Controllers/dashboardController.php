<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\Models\BusinessesModel;
use App\Models\CommentsModel;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\NewsModel;
use App\Models\PostsModel;
use App\Models\ServicesModel;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class dashboardController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $communityIds = CommunitiesModel::whereHas('members', function ($query) {
            $query->where('user_id', Auth::id())
                ->where('role', CommunityMemberRole::Admin);
        })->pluck('id');

        $businessesCount = BusinessesModel::whereIn('community_id', $communityIds)->count();
        $postsCount = PostsModel::whereIn('community_id', $communityIds)->count();
        $newsCount = NewsModel::whereIn('community_id', $communityIds)->count();
        $servicesCount = ServicesModel::whereIn('community_id', $communityIds)->count();
        $membersCount = CommunityMembersModel::whereIn('community_id', $communityIds)->count();
        $commentsCount = CommentsModel::whereHasMorph(
            'commentable',
            [PostsModel::class, NewsModel::class, BusinessesModel::class, ServicesModel::class],
            function ($query) use ($communityIds) {
                $query->whereIn('community_id', $communityIds);
            }
        )->count();

        $stats = [
            'businesses' => $businessesCount,
            'posts' => $postsCount,
            'news' => $newsCount,
            'services' => $servicesCount,
            'members' => $membersCount,
            'comments' => $commentsCount,
        ];

        if ($user && $user->isSuperAdmin()) {
            $stats['users'] = User::count();
            $stats['communities'] = CommunitiesModel::count();
        }

        return Inertia::render('dashboard', [
            'user' => $user,
            'stats' => $stats,
        ]);
    }
}
