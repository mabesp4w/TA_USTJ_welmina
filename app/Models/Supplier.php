<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Supplier extends Model
{
    protected $fillable = [
        'supplier_name',
        'phone',
        'email',
        'address',
        'notes',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(InventoryItem::class, 'supplier_id');
    }
}
