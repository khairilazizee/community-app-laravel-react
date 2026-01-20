<?php

namespace App\Http\Controllers\Concerns;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use Illuminate\Support\Facades\Auth;

trait CommunityAccess
{
    protected function requireMember(CommunitiesModel $community): CommunityMembersModel
    {
        $member = $community->members()
            ->where('user_id', Auth::id())
            ->where('status', CommunityMemberStatus::Active)
            ->first();

        if (!$member) {
            abort(403, 'Unauthorized');
        }

        return $member;
    }

    protected function requireAdmin(CommunitiesModel $community): CommunityMembersModel
    {
        $member = $this->requireMember($community);

        if ($member->role !== CommunityMemberRole::Admin) {
            abort(403, 'Unauthorized');
        }

        return $member;
    }
}
