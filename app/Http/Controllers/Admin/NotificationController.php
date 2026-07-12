<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class NotificationController extends Controller
{
    public function index(Request $request): Response
    {
        $type = $request->query('type');

        $query = Notification::with('creator');

        if ($type) {
            $query->where('notification_type', $type);
        }

        $notifications = $query
            ->orderByDesc('created_at')
            ->paginate(10)
            ->through(fn (Notification $n) => [
                'id' => $n->id,
                'title' => $n->title,
                'message' => $n->message,
                'notificationType' => $n->notification_type,
                'isRead' => $n->is_read,
                'createdAt' => $n->created_at?->format('Y-m-d H:i:s'),
            ]);

        $stats = [
            'total' => Notification::count(),
            'unread' => Notification::where('is_read', false)->count(),
            'recentToday' => Notification::whereDate('created_at', today())->count(),
        ];

        return Inertia::render('admin/Notification', [
            'notifications' => $notifications,
            'stats' => $stats,
        ]);
    }

    public function show(Notification $notification): JsonResponse
    {
        $notification->load('creator');

        if (! $notification->is_read) {
            $notification->update(['is_read' => true]);
        }

        return response()->json([
            'id' => $notification->id,
            'title' => $notification->title,
            'message' => $notification->message,
            'notificationType' => $notification->notification_type,
            'isRead' => true,
            'createdAt' => $notification->created_at?->format('Y-m-d H:i:s'),
            'relatedTable' => $notification->related_table,
            'relatedId' => $notification->related_id,
            'creatorName' => $notification->creator?->name,
        ]);
    }

    public function markAllAsRead(): RedirectResponse
    {
        Notification::where('is_read', false)->update(['is_read' => true]);

        return redirect()->route('admin.notification')->with('success', 'Semua notifikasi ditandai sudah dibaca!');
    }

    public function destroy(Notification $notification): RedirectResponse
    {
        $notification->delete();

        return redirect()->route('admin.notification')->with('success', 'Notifikasi berhasil dihapus!');
    }
}
