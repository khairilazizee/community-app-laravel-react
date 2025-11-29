<?php

namespace App\Http\Controllers;

use App\CommunityMemberRole;
use App\CommunityMemberStatus;
use App\Models\CommunitiesModel;
use App\Models\CommunityMembersModel;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class communitiesController extends Controller
{
    public function index()
    {
        return Inertia::render('communities');
    }

    public function create()
    {
        return Inertia::render('communities/create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'community_name' => 'required|string|max:255',
            'community_description' => 'required|string|max:255',
            'community_slug' => 'required|string|max:255',
            'banner_image' => 'nullable|image|max:2048',
            'logo_image' => 'nullable|image|max:2048',
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
}
