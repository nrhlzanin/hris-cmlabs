<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Helpers\TimezoneHelper;

class LetterHistory extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'letter_id',
        'status',
        'description',
        'actor',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'letter_id' => 'integer',
        ];
    }

    /**
     * Get the letter that owns this history.
     */
    public function letter()
    {
        return $this->belongsTo(Letter::class);
    }

    /**
     * Get formatted date in Jakarta timezone.
     */
    public function getFormattedDateAttribute(): string
    {
        return TimezoneHelper::formatJakarta($this->created_at, 'd M Y, H:i') . ' WIB';
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }
}
