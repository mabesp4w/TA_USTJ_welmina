<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class InventoryItem extends Model
{
    protected $table = 'inventory_items';

    protected $fillable = [
        'item_code',
        'item_name',
        'category_id',
        'stock',
        'item_condition',
        'item_status',
        'location_name',
        'supplier_id',
        'last_service_date',
        'image_path',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'last_service_date' => 'date:Y-m-d',
        ];
    }

    public function category(): BelongsTo
    {
        return $this->belongsTo(InventoryCategory::class, 'category_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
