<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MembershipPackage extends Model
{
    protected $fillable = [
        'package_name',
        'registration_fee',
        'description',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'registration_fee' => 'decimal:2',
            'is_active' => 'boolean',
        ];
    }

    public function prices(): HasMany
    {
        return $this->hasMany(MembershipPackagePrice::class, 'package_id');
    }

    public function memberships(): HasMany
    {
        return $this->hasMany(MemberMembership::class, 'package_id');
    }
}
