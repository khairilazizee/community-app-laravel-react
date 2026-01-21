<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\ItemCategory;
use App\Models\ServicesModel;
use App\Models\ServiceOffering;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommunityServicesController extends Controller
{
    use CommunityAccess;

    public function index(int $communityId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $this->requireMember($community);

        return Inertia::render('communities/services/index', [
            'community' => $community,
            'services' => $community->services()->latest()->get(),
            'members' => $community->members,
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $this->requireAdmin($community);

        return Inertia::render('communities/services/create', [
            'community' => $community,
            'members' => $community->members,
        ]);
    }

    public function edit(int $communityId, int $serviceId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $member = $this->requireMember($community);

        $service = ServicesModel::where('community_id', $community->id)
            ->with(['offerings.category'])
            ->findOrFail($serviceId);
        if ($member->role !== CommunityMemberRole::Admin && $service->owner_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $service->owner_id === Auth::id();
        $hasOwner = !is_null($service->owner_id);

        return Inertia::render('communities/services/edit', [
            'community' => $community,
            'service' => $service,
            'members' => $community->members,
            'can_edit_fields' => $isOwner || ($isAdmin && !$hasOwner),
            'can_change_owner' => $isAdmin,
        ]);
    }

    public function show(string $communitySlug, int $serviceId)
    {
        $community = CommunitiesModel::where('slug', $communitySlug)->firstOrFail();
        $member = null;

        if (Auth::check()) {
            $member = $community->members()
                ->where('user_id', Auth::id())
                ->where('status', CommunityMemberStatus::Active)
                ->first();
        }

        if ($community->is_private && !$member) {
            abort(404);
        }

        $service = ServicesModel::where('community_id', $community->id)
            ->with(['offerings.category'])
            ->findOrFail($serviceId);

        if ($service->is_private || !$service->is_active) {
            abort(404);
        }

        return Inertia::render('communities/services/show', [
            'community' => $community,
            'service' => $service,
            'is_member' => (bool) $member,
        ]);
    }

    public function store(Request $request, int $communityId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $this->requireAdmin($community);

        $data = $request->validate([
            'name' => 'required|string|max:255',
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
            'service_offerings' => 'nullable|array',
            'service_offerings.*.name' => 'nullable|string|max:255',
            'service_offerings.*.price' => 'nullable|numeric|min:0',
            'service_offerings.*.duration_minutes' => 'nullable|integer|min:0',
            'service_offerings.*.category' => 'nullable|string|max:255',
            'service_offerings.*.description' => 'nullable|string',
            'service_offerings.*.sort_order' => 'nullable|integer|min:0',
        ]);

        $ownerId = $this->ensureOwnerMember($community, $data['owner_id'] ?? null);

        $service = ServicesModel::create([
            'community_id' => $community->id,
            'owner_id' => $ownerId,
            'name' => $data['name'],
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

        $this->syncServiceOfferings(
            $service,
            $community,
            $data['service_offerings'] ?? null,
        );

        return back()->with('status', 'Service created successfully.');
    }

    public function update(Request $request, int $communityId, int $serviceId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $service = ServicesModel::where('community_id', $community->id)->findOrFail($serviceId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $service->owner_id === Auth::id();
        $hasOwner = !is_null($service->owner_id);

        if (!$isAdmin && !$isOwner) {
            abort(403, 'Unauthorized');
        }

        $canEditFields = $isOwner || ($isAdmin && !$hasOwner);

        if (!$canEditFields && $isAdmin) {
            $data = $request->validate([
                'owner_id' => 'nullable|integer|exists:users,id',
            ]);
        } else {
            $data = $request->validate([
                'name' => 'required|string|max:255',
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
                'service_offerings' => 'nullable|array',
                'service_offerings.*.name' => 'nullable|string|max:255',
                'service_offerings.*.price' => 'nullable|numeric|min:0',
                'service_offerings.*.duration_minutes' => 'nullable|integer|min:0',
                'service_offerings.*.category' => 'nullable|string|max:255',
                'service_offerings.*.description' => 'nullable|string',
                'service_offerings.*.sort_order' => 'nullable|integer|min:0',
            ]);
        }

        $ownerId = $data['owner_id'] ?? $service->owner_id;
        if ($isAdmin) {
            $ownerId = $this->ensureOwnerMember($community, $ownerId);
        }

        if ($canEditFields) {
            $service->fill([
                'owner_id' => $ownerId,
                'name' => $data['name'],
                'description' => $data['description'] ?? null,
                'address' => $data['address'] ?? null,
                'city' => $data['city'] ?? null,
                'state' => $data['state'] ?? null,
                'zip' => $data['zip'] ?? null,
                'country' => $data['country'] ?? null,
                'phone' => $data['phone'] ?? null,
                'website' => $data['website'] ?? null,
                'email' => $data['email'] ?? null,
                'is_private' => $data['is_private'] ?? $service->is_private,
                'is_active' => $data['is_active'] ?? $service->is_active,
            ]);
        } else {
            $service->owner_id = $ownerId;
        }
        $service->save();

        $this->syncServiceOfferings(
            $service,
            $community,
            $data['service_offerings'] ?? null,
        );

        return back()->with('status', 'Service updated successfully.');
    }

    public function delete(int $communityId, int $serviceId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $service = ServicesModel::where('community_id', $community->id)->findOrFail($serviceId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $service->owner_id === Auth::id();
        $hasOwner = !is_null($service->owner_id);

        if (!$isOwner && !($isAdmin && !$hasOwner)) {
            abort(403, 'Unauthorized');
        }
        $service->delete();

        return back()->with('status', 'Service deleted successfully.');
    }

    private function ensureOwnerMember(CommunitiesModel $community, ?int $ownerId): ?int
    {
        if (!$ownerId) {
            return null;
        }

        $owner = User::findOrFail($ownerId);
        $member = CommunityMembersModel::where('community_id', $community->id)
            ->where('user_id', $owner->id)
            ->first();

        if ($member) {
            if ($member->status !== CommunityMemberStatus::Active) {
                $member->status = CommunityMemberStatus::Active;
                $member->save();
            }
        } else {
            CommunityMembersModel::create([
                'community_id' => $community->id,
                'user_id' => $owner->id,
                'role' => CommunityMemberRole::Owner,
                'status' => CommunityMemberStatus::Active,
            ]);
        }

        return $owner->id;
    }

    private function syncServiceOfferings(
        ServicesModel $service,
        CommunitiesModel $community,
        ?array $offerings,
    ): void {
        if (is_null($offerings)) {
            return;
        }

        $service->offerings()->delete();

        $filtered = array_values(array_filter($offerings, function ($item) {
            return isset($item['name']) && trim($item['name']) !== '';
        }));

        foreach ($filtered as $item) {
            $categoryId = $this->resolveCategoryId(
                $community,
                $item['category'] ?? null,
                'service',
            );

            $service->offerings()->create([
                'category_id' => $categoryId,
                'name' => $item['name'],
                'price' => $item['price'] ?? null,
                'duration_minutes' => $item['duration_minutes'] ?? null,
                'description' => $item['description'] ?? null,
                'sort_order' => $item['sort_order'] ?? 0,
            ]);
        }
    }

    private function resolveCategoryId(
        CommunitiesModel $community,
        ?string $name,
        string $type,
    ): ?int {
        $trimmed = $name ? trim($name) : '';
        if ($trimmed === '') {
            return null;
        }

        $category = ItemCategory::firstOrCreate([
            'community_id' => $community->id,
            'type' => $type,
            'name' => $trimmed,
        ]);

        return $category->id;
    }
}
