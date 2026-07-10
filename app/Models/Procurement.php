<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Procurement extends Model
{
    protected $fillable = [
        'procurement_code',
        'item_id',
        'supplier_id',
        'quantity',
        'unit_price',
        'total_price',
        'procurement_date',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'procurement_date' => 'date:Y-m-d',
            'unit_price' => 'decimal:2',
            'total_price' => 'decimal:2',
        ];
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(InventoryItem::class, 'item_id');
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }
}
