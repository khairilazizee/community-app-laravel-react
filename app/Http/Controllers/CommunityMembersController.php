<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\User;
use Illuminate\Http\Request;

class CommunityMembersController extends Controller
{
    use CommunityAccess;

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'user_id' => 'nullable|integer|exists:users,id',
            'email' => 'nullable|email',
            'role' => 'nullable|string|in:admin,owner,member',
        ]);

        $user = null;
        if (!empty($data['user_id'])) {
            $user = User::findOrFail($data['user_id']);
        } elseif (!empty($data['email'])) {
            $user = User::where('email', $data['email'])->first();
        }

        if (!$user) {
            return back()->withErrors(['email' => 'User not found for invite.']);
        }

        CommunityMembersModel::updateOrCreate(
            [
                'community_id' => $community->id,
                'user_id' => $user->id,
            ],
            [
                'role' => CommunityMemberRole::from($data['role'] ?? 'member'),
                'status' => CommunityMemberStatus::Active,
            ]
        );

        return back()->with('status', 'Member added successfully.');
    }

    public function update(Request $request, int $communityId, int $memberId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'role' => 'required|string|in:admin,owner,member',
            'status' => 'nullable|string|in:active,inactive',
        ]);

        $member = CommunityMembersModel::where('community_id', $community->id)
            ->findOrFail($memberId);

        $member->role = CommunityMemberRole::from($data['role']);
        if (!empty($data['status'])) {
            $member->status = CommunityMemberStatus::from($data['status']);
        }
        $member->save();

        return back()->with('status', 'Member updated successfully.');
    }

    public function delete(int $communityId, int $memberId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $member = CommunityMembersModel::where('community_id', $community->id)
            ->findOrFail($memberId);

        $member->delete();

        return back()->with('status', 'Member removed successfully.');
    }
}
