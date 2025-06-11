<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PaymentMethod extends Model
{
    protected $fillable = [
        'name',
        'type',
        'logo',
        'processing_fee',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'processing_fee' => 'decimal:2',
    ];

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function isCard(): bool
    {
        return $this->type === 'card';
    }

    public function isBank(): bool
    {
        return $this->type === 'bank';
    }

    public function isDigitalWallet(): bool
    {
        return $this->type === 'digital_wallet';
    }
}
