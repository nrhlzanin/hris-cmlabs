<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Plan extends Model
{
    protected $fillable = [
        'name',
        'description',
        'type',
        'monthly_price',
        'yearly_price',
        'seat_price',
        'currency',
        'features',
        'is_recommended',
        'is_popular',
        'button_text',
        'button_variant',
        'min_seats',
        'max_seats',
        'is_active',
    ];

    protected $casts = [
        'features' => 'array',
        'is_recommended' => 'boolean',
        'is_popular' => 'boolean',
        'is_active' => 'boolean',
        'monthly_price' => 'decimal:2',
        'yearly_price' => 'decimal:2',
        'seat_price' => 'decimal:2',
    ];

    public function subscriptions(): HasMany
    {
        return $this->hasMany(Subscription::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function isPackagePlan(): bool
    {
        return $this->type === 'package';
    }

    public function isSeatPlan(): bool
    {
        return $this->type === 'seat';
    }

    public function getPrice(string $period = 'monthly'): float
    {
        if ($this->isSeatPlan()) {
            return (float) $this->seat_price;
        }

        return $period === 'yearly' ? (float) $this->yearly_price : (float) $this->monthly_price;
    }
}
