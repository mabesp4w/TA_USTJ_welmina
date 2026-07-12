<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureRole
{
    private const ROLE_DASHBOARD = [
        'administrator' => 'admin.dashboard',
        'pengelola' => 'pengelola.dashboard',
        'pimpinan' => 'pimpinan.dashboard',
    ];

    /**
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (! $user || ! in_array($user->role, $roles, true)) {
            $dashboard = self::ROLE_DASHBOARD[$user?->role] ?? 'home';

            return redirect()->route($dashboard);
        }

        return $next($request);
    }
}
