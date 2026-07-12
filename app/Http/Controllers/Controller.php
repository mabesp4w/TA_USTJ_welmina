<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Inertia\Response;

abstract class Controller
{
    protected function inertia(string $page, array $data = []): Response
    {
        $routeName = request()->route()?->getName();

        if ($routeName && str_starts_with($routeName, 'pengelola.')) {
            $page = str_replace('admin/', 'pengelola/', $page);
        } elseif ($routeName && str_starts_with($routeName, 'pimpinan.')) {
            $page = str_replace('admin/', 'pimpinan/', $page);
        }

        return Inertia::render($page, $data);
    }
}
