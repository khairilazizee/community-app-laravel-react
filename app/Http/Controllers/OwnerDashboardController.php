<?php

namespace App\Http\Controllers;

use App\Models\BusinessesModel;
use App\Models\ServicesModel;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OwnerDashboardController extends Controller
{
    public function index()
    {
        $businesses = BusinessesModel::with('community')
            ->where('owner_id', Auth::id())
            ->latest()
            ->get();

        $services = ServicesModel::with('community')
            ->where('owner_id', Auth::id())
            ->latest()
            ->get();

        return Inertia::render('owner/index', [
            'businesses' => $businesses,
            'services' => $services,
        ]);
    }
}
