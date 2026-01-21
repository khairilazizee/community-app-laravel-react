<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\BusinessesModel;
use App\Models\BusinessHour;
use App\Models\BusinessItem;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\ItemCategory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class CommunityBusinessesController extends Controller
{
    use CommunityAccess;

    public function index(int $communityId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $this->requireMember($community);

        return Inertia::render('communities/businesses/index', [
            'community' => $community,
            'businesses' => $community->businesses()->latest()->get(),
            'members' => $community->members,
        ]);
    }

    public function create(int $communityId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $this->requireAdmin($community);

        return Inertia::render('communities/businesses/create', [
            'community' => $community,
            'members' => $community->members,
        ]);
    }

    public function edit(int $communityId, int $businessId)
    {
        $community = CommunitiesModel::with(['members.user'])->findOrFail($communityId);
        $member = $this->requireMember($community);

        $business = BusinessesModel::where('community_id', $community->id)
            ->with(['items.category', 'hours'])
            ->findOrFail($businessId);
        if ($member->role !== CommunityMemberRole::Admin && $business->owner_id !== Auth::id()) {
            abort(403, 'Unauthorized');
        }

        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $business->owner_id === Auth::id();
        $hasOwner = !is_null($business->owner_id);

        return Inertia::render('communities/businesses/edit', [
            'community' => $community,
            'business' => $business,
            'members' => $community->members,
            'can_edit_fields' => $isOwner || ($isAdmin && !$hasOwner),
            'can_change_owner' => $isAdmin,
        ]);
    }

    public function show(string $communitySlug, int $businessId)
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

        $business = BusinessesModel::where('community_id', $community->id)
            ->with(['items.category', 'hours'])
            ->findOrFail($businessId);

        if ($business->is_private || !$business->is_active) {
            abort(404);
        }

        return Inertia::render('communities/businesses/show', [
            'community' => $community,
            'business' => $business,
            'is_member' => (bool) $member,
        ]);
    }

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
            'business_items' => 'nullable|array',
            'business_items.*.name' => 'nullable|string|max:255',
            'business_items.*.price' => 'nullable|numeric|min:0',
            'business_items.*.category' => 'nullable|string|max:255',
            'business_items.*.description' => 'nullable|string',
            'business_items.*.sort_order' => 'nullable|integer|min:0',
            'business_hours' => 'nullable|array',
            'business_hours.*.day_of_week' => 'required|integer|min:0|max:6',
            'business_hours.*.open_time' => 'nullable|date_format:H:i',
            'business_hours.*.close_time' => 'nullable|date_format:H:i',
            'business_hours.*.is_closed' => 'nullable|boolean',
        ]);

        $ownerId = $data['owner_id'] ?? Auth::id();
        $ownerId = $this->ensureOwnerMember($community, $ownerId);

        $business = BusinessesModel::create([
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

        $this->syncBusinessItems($business, $community, $data['business_items'] ?? null);
        $this->syncBusinessHours($business, $data['business_hours'] ?? null);

        return back()->with('status', 'Business created successfully.');
    }

    public function update(Request $request, int $communityId, int $businessId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $business = BusinessesModel::where('community_id', $community->id)->findOrFail($businessId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $business->owner_id === Auth::id();
        $hasOwner = !is_null($business->owner_id);

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
                'business_items' => 'nullable|array',
                'business_items.*.name' => 'nullable|string|max:255',
                'business_items.*.price' => 'nullable|numeric|min:0',
                'business_items.*.category' => 'nullable|string|max:255',
                'business_items.*.description' => 'nullable|string',
                'business_items.*.sort_order' => 'nullable|integer|min:0',
                'business_hours' => 'nullable|array',
                'business_hours.*.day_of_week' => 'required|integer|min:0|max:6',
                'business_hours.*.open_time' => 'nullable|date_format:H:i',
                'business_hours.*.close_time' => 'nullable|date_format:H:i',
                'business_hours.*.is_closed' => 'nullable|boolean',
            ]);
        }

        $ownerId = $data['owner_id'] ?? $business->owner_id;
        if ($isAdmin) {
            $ownerId = $this->ensureOwnerMember($community, $ownerId);
        }

        if ($canEditFields) {
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
        } else {
            $business->owner_id = $ownerId;
        }
        $business->save();

        $this->syncBusinessItems($business, $community, $data['business_items'] ?? null);
        $this->syncBusinessHours($business, $data['business_hours'] ?? null);

        return back()->with('status', 'Business updated successfully.');
    }

    public function delete(int $communityId, int $businessId)
    {
        $community = CommunitiesModel::findOrFail($communityId);
        $member = $this->requireMember($community);

        $business = BusinessesModel::where('community_id', $community->id)->findOrFail($businessId);
        $isAdmin = $member->role === CommunityMemberRole::Admin;
        $isOwner = $business->owner_id === Auth::id();
        $hasOwner = !is_null($business->owner_id);

        if (!$isOwner && !($isAdmin && !$hasOwner)) {
            abort(403, 'Unauthorized');
        }
        $business->delete();

        return back()->with('status', 'Business deleted successfully.');
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

    private function syncBusinessItems(
        BusinessesModel $business,
        CommunitiesModel $community,
        ?array $items,
    ): void {
        if (is_null($items)) {
            return;
        }

        $business->items()->delete();

        $filtered = array_values(array_filter($items, function ($item) {
            return isset($item['name']) && trim($item['name']) !== '';
        }));

        foreach ($filtered as $item) {
            $categoryId = $this->resolveCategoryId(
                $community,
                $item['category'] ?? null,
                'business',
            );

            $business->items()->create([
                'category_id' => $categoryId,
                'name' => $item['name'],
                'price' => $item['price'] ?? null,
                'description' => $item['description'] ?? null,
                'sort_order' => $item['sort_order'] ?? 0,
            ]);
        }
    }

    private function syncBusinessHours(BusinessesModel $business, ?array $hours): void
    {
        if (is_null($hours)) {
            return;
        }

        $business->hours()->delete();

        foreach ($hours as $hour) {
            if (!isset($hour['day_of_week'])) {
                continue;
            }

            $isClosed = (bool) ($hour['is_closed'] ?? false);
            $business->hours()->create([
                'day_of_week' => $hour['day_of_week'],
                'open_time' => $isClosed ? null : ($hour['open_time'] ?? null),
                'close_time' => $isClosed ? null : ($hour['close_time'] ?? null),
                'is_closed' => $isClosed,
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
