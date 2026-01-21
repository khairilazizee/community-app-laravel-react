<?php

namespace App\Http\Controllers\superadmin;

use App\Http\Controllers\Controller;
use App\Models\CommunitiesModel;
use Illuminate\Http\Request;
use Inertia\Inertia;

class communitiesController extends Controller
{
    public function index()
    {
        return Inertia::render('superadmin/communities', [
            'activeCommunities' => CommunitiesModel::withCount('members')->get(),
            'deletedCommunities' => CommunitiesModel::onlyTrashed()
                ->withCount('members')
                ->get(),
        ]);
    }
}
