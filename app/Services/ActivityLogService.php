<?php

namespace App\Services;

use App\Models\ActivityLog;

class ActivityLogService
{
    public static function log(
        string $activityType,
        string $activityName,
        ?string $description = null,
        ?int $inventoryItemId = null,
        ?int $memberId = null,
        ?int $userId = null,
        ?string $referenceTable = null,
        ?int $referenceId = null,
    ): ActivityLog {
        return ActivityLog::create([
            'activity_time' => now(),
            'activity_name' => $activityName,
            'activity_type' => $activityType,
            'inventory_item_id' => $inventoryItemId,
            'member_id' => $memberId,
            'user_id' => $userId ?? auth()->id(),
            'description' => $description,
            'reference_table' => $referenceTable,
            'reference_id' => $referenceId,
        ]);
    }
}
