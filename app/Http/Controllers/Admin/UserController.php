<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreUserRequest;
use App\Models\User;
use App\Services\ActivityLogService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');

        $query = User::where('role', '!=', 'administrator');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('full_name', 'like', "%{$search}%")
                    ->orWhere('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query
            ->orderBy('full_name')
            ->paginate(10)
            ->through(fn (User $u) => [
                'id' => $u->id,
                'fullName' => $u->full_name,
                'username' => $u->username,
                'email' => $u->email,
                'role' => $u->role,
                'isActive' => $u->is_active,
            ]);

        $stats = [
            'total' => User::where('role', '!=', 'administrator')->count(),
            'active' => User::where('is_active', true)->where('role', '!=', 'administrator')->count(),
            'roles' => User::selectRaw('role, count(*) as total')
                ->where('role', '!=', 'administrator')
                ->groupBy('role')
                ->orderByDesc('total')
                ->pluck('total', 'role'),
        ];

        return Inertia::render('admin/User', [
            'users' => $users,
            'stats' => $stats,
        ]);
    }

    public function store(StoreUserRequest $request): RedirectResponse
    {
        $user = User::create([
            'full_name' => $request->input('fullName'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'password_hash' => bcrypt($request->input('password')),
            'role' => $request->input('role'),
            'is_active' => $request->boolean('isActive', true),
        ]);

        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Tambah Pengguna: '.$user->full_name,
            description: 'Menambahkan pengguna baru "'.$user->full_name.'" ('.$user->username.') dengan role '.$user->role,
            referenceTable: 'users',
            referenceId: $user->id,
        );

        return redirect()->route('admin.user')->with('success', 'Pengguna berhasil disimpan!');
    }

    public function show(User $user): JsonResponse
    {
        return response()->json([
            'id' => $user->id,
            'fullName' => $user->full_name,
            'username' => $user->username,
            'email' => $user->email,
            'role' => $user->role,
            'isActive' => $user->is_active,
        ]);
    }

    public function update(StoreUserRequest $request, User $user): RedirectResponse
    {
        $data = [
            'full_name' => $request->input('fullName'),
            'username' => $request->input('username'),
            'email' => $request->input('email'),
            'role' => $request->input('role'),
            'is_active' => $request->boolean('isActive', true),
        ];

        if ($password = $request->input('password')) {
            $data['password_hash'] = bcrypt($password);
        }

        $user->update($data);

        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Update Pengguna: '.$user->full_name,
            description: 'Memperbarui data pengguna "'.$user->full_name.'" ('.$user->username.')',
            referenceTable: 'users',
            referenceId: $user->id,
        );

        return redirect()->route('admin.user')->with('success', 'Pengguna berhasil diperbarui!');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return redirect()->route('admin.user')->with('error', 'Tidak dapat menghapus akun sendiri!');
        }

        ActivityLogService::log(
            activityType: 'lainnya',
            activityName: 'Hapus Pengguna: '.$user->full_name,
            description: 'Menghapus pengguna "'.$user->full_name.'" ('.$user->username.')',
            referenceTable: 'users',
            referenceId: $user->id,
        );

        $user->delete();

        return redirect()->route('admin.user')->with('success', 'Pengguna berhasil dihapus!');
    }
}
