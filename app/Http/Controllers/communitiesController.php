<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Http\Controllers\Concerns\CommunityAccess;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use App\Models\NewsModel;
use App\Models\PostsModel;
use App\Models\ServicesModel;
use App\Models\BusinessesModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class communitiesController extends Controller
{
    use CommunityAccess;

    public function index()
    {
        return Inertia::render('communities', [
            'my_communities' => CommunitiesModel::with('members')->whereHas('members', fn($q) => $q->where('user_id', Auth::user()->id))->get(),
            'all_communities' => CommunitiesModel::with('members')->whereDoesntHave('members', fn($q) => $q->where('user_id', Auth::user()->id))->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('communities/create');
    }

    public function show(string $slug)
    {
        $community = CommunitiesModel::where('slug', $slug)->firstOrFail();

        $member = null;
        if (Auth::check()) {
            $member = $community->members()
                ->where('user_id', Auth::id())
                ->where('status', CommunityMemberStatus::Active)
                ->first();
        }

        if ($community->is_private) {
            if (!$member) {
                abort(404);
            }
        }

        return Inertia::render('communities/show', [
            'community' => $community,
            'posts' => PostsModel::where('community_id', $community->id)->latest()->get(),
            'news' => NewsModel::where('community_id', $community->id)->latest()->get(),
            'services' => ServicesModel::where('community_id', $community->id)->latest()->get(),
            'businesses' => $community->businesses()->latest()->get(),
            'is_member' => (bool) $member,
            'member_role' => $member?->role?->value,
        ]);
    }

    public function memberShow(string $slug)
    {
        $community = CommunitiesModel::where('slug', $slug)->firstOrFail();
        $member = $community->members()
            ->where('user_id', Auth::id())
            ->first();

        if (!$member) {
            abort(403, 'Unauthorized');
        }

        $ownedBusinesses = BusinessesModel::where('community_id', $community->id)
            ->where('owner_id', Auth::id())
            ->latest()
            ->get();
        $ownedServices = ServicesModel::where('community_id', $community->id)
            ->where('owner_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('communities/member', [
            'community' => $community,
            'posts' => PostsModel::where('community_id', $community->id)->latest()->get(),
            'news' => NewsModel::where('community_id', $community->id)->latest()->get(),
            'services' => ServicesModel::where('community_id', $community->id)->latest()->get(),
            'businesses' => $community->businesses()->latest()->get(),
            'member' => [
                'role' => $member->role?->value,
                'status' => $member->status?->value,
            ],
            'owned_businesses' => $ownedBusinesses,
            'owned_services' => $ownedServices,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'community_name' => 'required|string|max:255',
            'community_description' => 'required|string|max:255',
            'community_slug' => 'required|string|max:255',
            'banner_image' => 'required|image|max:2048',
            'logo_image' => 'required|image|max:2048',
            'is_private' => 'required|boolean',
        ]);

        if ($request->hasFile('banner_image')) {
            $data['banner_image'] = $request->file('banner_image')->store('uploads/communities', 'public');
        }

        if ($request->hasFile('logo_image')) {
            $data['logo_image'] = $request->file('logo_image')->store('uploads/communities', 'public');
        }

        $community = CommunitiesModel::create([
            'name' => $data['community_name'],
            'slug' => $data['community_slug'],
            'description' => $data['community_description'],
            'is_private' => $data['is_private'],
            'banner_image' => $data['banner_image'] ?? null,
            'logo_image' => $data['logo_image'] ?? null,
            'created_at' => now(),
            'created_by' => Auth::user()->id,
        ]);

        CommunityMembersModel::create([
            'community_id' => $community->id,
            'user_id' => Auth::user()->id,
            'role' => CommunityMemberRole::Admin,
            'status' => CommunityMemberStatus::Active,
            'created_at' => now(),
        ]);

        return redirect()->route('communities.index')->with('status', 'Community created successfully.');
    }

    public function edit(int $id)
    {
        $community = CommunitiesModel::with('members')->findOrFail($id);
        $this->requireAdmin($community);

        return Inertia::render('communities/edit', [
            'community' => $community->load(['members.user', 'businesses', 'posts', 'news', 'services'])
        ]);
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'community_name' => 'required|string|max:255',
            'community_description' => 'required|string|max:255',
            'community_slug' => 'required|string|max:255',
            // 'banner_image' => 'required|image|max:2048',
            // 'logo_image' => 'required|image|max:2048',
            'is_private' => 'required|boolean',
        ]);

        $community = CommunitiesModel::findOrFail($id);
        $this->requireAdmin($community);

        $community->fill([
            'name' => $data['community_name'],
            'slug' => $data['community_slug'],
            'description' => $data['community_description'],
            'is_private' => $data['is_private'],
            'updated_at' => now(),
            // 'banner_image' => $data['banner_image'] ?? null,
            // 'logo_image' => $data['logo_image'] ?? null,
        ]);

        $community->save();

        return redirect()->route('communities.index')->with('status', 'Community updated successfully.');
    }

    public function delete(int $id)
    {
        $community = CommunitiesModel::with('members')->findOrFail($id);
        $this->requireAdmin($community);

        // if ($community->members->count() > 1) {
        //     return redirect()->route('communities.index')->with('status', 'Community cannot be deleted because it has members.');
        // }
        $community->members()->delete();
        $community->delete();

        return redirect()->route('communities.index')->with('status', 'Community deleted successfully.');
    }
}
