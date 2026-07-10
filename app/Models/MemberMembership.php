<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MemberMembership extends Model
{
    protected $table = 'member_memberships';

    protected $fillable = [
        'member_id',
        'package_id',
        'duration_months',
        'start_date',
        'end_date',
        'amount',
        'admin_fee',
        'payment_method',
        'payment_status',
        'due_date',
        'paid_at',
        'status',
        'notes',
        'created_by',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'due_date' => 'date:Y-m-d',
            'paid_at' => 'datetime:Y-m-d H:i:s',
            'amount' => 'decimal:2',
            'admin_fee' => 'decimal:2',
        ];
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class);
    }

    public function package(): BelongsTo
    {
        return $this->belongsTo(MembershipPackage::class, 'package_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
