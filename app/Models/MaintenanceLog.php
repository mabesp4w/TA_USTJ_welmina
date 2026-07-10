<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MaintenanceLog extends Model
{
    protected $table = 'maintenance_logs';

    protected $fillable = [
        'inventory_item_id',
        'maintenance_type',
        'maintenance_date',
        'cost',
        'result_condition',
        'performed_by',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'maintenance_date' => 'date:Y-m-d',
            'cost' => 'decimal:2',
        ];
    }

    public function inventoryItem(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'inventory_item_id');
    }
}
