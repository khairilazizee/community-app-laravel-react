<?php

namespace App\Http\Controllers\superadmin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class usersController extends Controller
{
    public function index()
    {
        return Inertia::render('superadmin/users/index', [
            'users' => User::all()
        ]);
    }

    public function edit(int $id)
    {
        $user = User::find($id);

        return Inertia::render('superadmin/users/edit', [
            'name' => $user->name,
            'email' => $user->email,
            'password' => '',
            'id' => $user->id,
            'is_superadmin' => $user->is_superadmin
        ]);
    }

    public function update(Request $request, int $id)
    {
        // dd($request);
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['nullable', 'string', 'min:8'],
        ]);

        $user = User::findOrFail($id);

        $user->fill([
            'name' => $data['name'],
            'email' => $data['email'],
        ]);

        if ($request->filled('password')) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return redirect()->route('superadmin.users.index')->with('status', 'User updated successfully.');
    }
}
