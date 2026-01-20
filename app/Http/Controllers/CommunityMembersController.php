<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CommunityMembersController extends Controller
{
    use CommunityAccess;

    public function index(int $communityId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $this->requireAdmin($community);

        return Inertia::render('communities/members/index', [
            'community' => $community,
            'members' => $community->members,
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        return Inertia::render('communities/members/create', [
            'community' => $community,
        ]);
    }

    public function edit(int $communityId, int $memberId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $member = CommunityMembersModel::with('user')
            ->where('community_id', $community->id)
            ->findOrFail($memberId);

        return Inertia::render('communities/members/edit', [
            'community' => $community,
            'member' => $member,
        ]);
    }

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'email' => 'required|email',
            'role' => 'nullable|string|in:admin,member',
        ]);

        $user = User::where('email', $data['email'])->first();

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
            'status' => 'nullable|string|in:pending,active,inactive',
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
