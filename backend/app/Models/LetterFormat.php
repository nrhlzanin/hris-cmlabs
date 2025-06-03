<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LetterFormat extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'id_letter';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name_letter',
        'content',
        'status',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'status' => 'string',
        ];
    }

    /**
     * Get the employees that use this letter format.
     */
    public function employees()
    {
        return $this->hasMany(Employee::class, 'letter_id', 'id_letter');
    }

    /**
     * Get the letters that use this letter format.
     */
    public function letters()
    {
        return $this->hasMany(Letter::class, 'name_letter_id', 'id_letter');
    }

    /**
     * Get the content file URL attribute.
     */
    public function getContentUrlAttribute(): ?string
    {
        return $this->content ? asset('storage/' . $this->content) : null;
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter active letter formats.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Check if the letter format is active.
     */
    public function isActive(): bool
    {
        return $this->status === 'active';
    }
}