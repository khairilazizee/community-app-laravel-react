<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
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
}
