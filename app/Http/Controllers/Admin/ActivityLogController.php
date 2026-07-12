<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ActivityLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    public function index(Request $request): Response
    {
        $search = $request->query('search');
        $type = $request->query('type');

        $query = ActivityLog::with('user');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('activity_name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        if ($type) {
            $query->where('activity_type', $type);
        }

        $logs = $query
            ->orderByDesc('activity_time')
            ->paginate(10)
            ->through(fn (ActivityLog $l) => [
                'id' => $l->id,
                'activityTime' => $l->activity_time?->format('Y-m-d H:i:s'),
                'activityName' => $l->activity_name,
                'activityType' => $l->activity_type,
                'description' => $l->description,
                'userName' => $l->user?->name ?? 'Sistem',
            ]);

        $stats = [
            'total' => ActivityLog::count(),
            'today' => ActivityLog::whereDate('activity_time', today())->count(),
            'types' => ActivityLog::selectRaw('activity_type, count(*) as total')
                ->groupBy('activity_type')
                ->orderByDesc('total')
                ->pluck('total', 'activity_type'),
        ];

        return Inertia::render('admin/ActivityLog', [
            'logs' => $logs,
            'stats' => $stats,
        ]);
    }

    public function show(ActivityLog $activityLog): JsonResponse
    {
        $activityLog->load('user');

        return response()->json([
            'id' => $activityLog->id,
            'activityTime' => $activityLog->activity_time?->format('Y-m-d H:i:s'),
            'activityName' => $activityLog->activity_name,
            'activityType' => $activityLog->activity_type,
            'description' => $activityLog->description,
            'userName' => $activityLog->user?->name ?? 'Sistem',
            'referenceTable' => $activityLog->reference_table,
            'referenceId' => $activityLog->reference_id,
        ]);
    }

    public function destroy(ActivityLog $activityLog): RedirectResponse
    {
        $activityLog->delete();

        return redirect()->route('admin.activity-log')->with('success', 'Log berhasil dihapus!');
    }
}
