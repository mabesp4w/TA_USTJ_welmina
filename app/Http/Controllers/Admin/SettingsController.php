<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Response;

class SettingsController extends Controller
{
    public function index(Request $request): Response
    {
        $user = $request->user();

        return $this->inertia('admin/Settings', [
            'user' => [
                'id' => $user->id,
                'fullName' => $user->full_name,
                'username' => $user->username,
                'email' => $user->email,
                'role' => $user->role,
            ],
        ]);
    }

    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'current_password' => ['required', 'string', 'current_password:web'],
            'username' => ['required', 'string', 'max:50', "unique:users,username,{$user->id}"],
            'password' => ['nullable', 'string', Password::min(5), 'confirmed'],
        ], [], [
            'current_password' => 'Password Lama',
            'username' => 'Username',
            'password' => 'Password Baru',
        ]);

        $user->username = $validated['username'];

        if (! empty($validated['password'])) {
            $user->password_hash = Hash::make($validated['password']);
        }

        $user->save();

        $routeName = $request->route()?->getName() === 'pengelola.settings.update'
            ? 'pengelola.settings'
            : ($request->route()?->getName() === 'pimpinan.settings.update'
                ? 'pimpinan.settings'
                : 'admin.settings');

        return redirect()->route($routeName)->with('success', 'Pengaturan berhasil diperbarui!');
    }
}
