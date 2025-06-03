<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Letter extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name_letter_id',
        'employee_name',
        'name',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'name_letter_id' => 'integer',
        ];
    }

    /**
     * Get the letter format that owns the letter.
     */
    public function letterFormat()
    {
        return $this->belongsTo(LetterFormat::class, 'name_letter_id', 'id_letter');
    }

    /**
     * Scope to filter by letter format.
     */
    public function scopeByLetterFormat($query, int $letterFormatId)
    {
        return $query->where('name_letter_id', $letterFormatId);
    }

    /**
     * Scope to filter by employee name.
     */
    public function scopeByEmployeeName($query, string $employeeName)
    {
        return $query->where('employee_name', 'like', '%' . $employeeName . '%');
    }

    /**
     * Scope to search by name.
     */
    public function scopeByName($query, string $name)
    {
        return $query->where('name', 'like', '%' . $name . '%');
    }

    /**
     * Get the formatted creation date.
     */
    public function getFormattedCreatedAtAttribute(): string
    {
        return $this->created_at->format('d M Y, H:i');
    }

    /**
     * Get the letter format name.
     */
    public function getLetterFormatNameAttribute(): ?string
    {
        return $this->letterFormat?->name_letter;
    }
}