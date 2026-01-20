<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\BusinessesModel;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CommunityBusinessesController extends Controller
{
    use CommunityAccess;

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'owner_id' => 'nullable|integer|exists:users,id',
            'is_private' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $ownerId = $this->ensureOwnerMember($community, $data['owner_id'] ?? null);

        BusinessesModel::create([
            'community_id' => $community->id,
            'owner_id' => $ownerId,
            'name' => $data['name'],
            'type' => $data['type'] ?? 'business',
            'description' => $data['description'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'zip' => $data['zip'] ?? null,
            'country' => $data['country'] ?? null,
            'phone' => $data['phone'] ?? null,
            'website' => $data['website'] ?? null,
            'email' => $data['email'] ?? null,
            'is_private' => $data['is_private'] ?? false,
            'is_active' => $data['is_active'] ?? true,
        ]);

        return back()->with('status', 'Business created successfully.');
    }

    public function update(Request $request, int $communityId, int $businessId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $business = BusinessesModel::where('community_id', $community->id)->findOrFail($businessId);
        if ($member->role !== CommunityMemberRole::Admin && $business->owner_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'type' => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'address' => 'nullable|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'zip' => 'nullable|string|max:255',
            'country' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:255',
            'website' => 'nullable|string|max:255',
            'email' => 'nullable|email|max:255',
            'owner_id' => 'nullable|integer|exists:users,id',
            'is_private' => 'nullable|boolean',
            'is_active' => 'nullable|boolean',
        ]);

        $ownerId = $data['owner_id'] ?? $business->owner_id;
        if ($member->role === CommunityMemberRole::Admin) {
            $ownerId = $this->ensureOwnerMember($community, $ownerId);
        }

        $business->fill([
            'owner_id' => $ownerId,
            'name' => $data['name'],
            'type' => $data['type'] ?? $business->type,
            'description' => $data['description'] ?? null,
            'address' => $data['address'] ?? null,
            'city' => $data['city'] ?? null,
            'state' => $data['state'] ?? null,
            'zip' => $data['zip'] ?? null,
            'country' => $data['country'] ?? null,
            'phone' => $data['phone'] ?? null,
            'website' => $data['website'] ?? null,
            'email' => $data['email'] ?? null,
            'is_private' => $data['is_private'] ?? $business->is_private,
            'is_active' => $data['is_active'] ?? $business->is_active,
        ]);
        $business->save();

        return back()->with('status', 'Business updated successfully.');
    }

    public function delete(int $communityId, int $businessId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $business = BusinessesModel::where('community_id', $community->id)->findOrFail($businessId);
        $business->delete();

        return back()->with('status', 'Business deleted successfully.');
    }

    private function ensureOwnerMember(CommunitiesModel $community, ?int $ownerId): ?int
    {
        if (!$ownerId) {
            return null;
        }

        $owner = User::findOrFail($ownerId);

        CommunityMembersModel::updateOrCreate(
            [
                'community_id' => $community->id,
                'user_id' => $owner->id,
            ],
            [
                'role' => CommunityMemberRole::Owner,
                'status' => CommunityMemberStatus::Active,
            ]
        );

        return $owner->id;
    }
}
