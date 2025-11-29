<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class dashboardController extends Controller
{
    public function index()
    {
        return Inertia::render('dashboard', [
            'user' => Auth::user()
        ]);
    }
}
