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
        'letter_type',
        'status',
        'valid_until',
        'description',
        'supporting_document',
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
            'valid_until' => 'date',
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
     * Get the letter histories.
     */
    public function histories()
    {
        return $this->hasMany(LetterHistory::class)->orderBy('created_at', 'desc');
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
     * Scope to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by letter type.
     */
    public function scopeByLetterType($query, string $letterType)
    {
        return $query->where('letter_type', $letterType);
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

    /**
     * Get the supporting document URL.
     */
    public function getSupportingDocumentUrlAttribute(): ?string
    {
        return $this->supporting_document ? asset('storage/' . $this->supporting_document) : null;
    }

    /**
     * Get formatted valid until date in Jakarta timezone.
     */
    public function getFormattedValidUntilAttribute(): ?string
    {
        return $this->valid_until ? $this->valid_until->format('d M Y') . ' WIB' : null;
    }

    /**
     * Check if letter is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if letter is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if letter is declined.
     */
    public function isDeclined(): bool
    {
        return $this->status === 'declined';
    }

    /**
     * Check if letter is waiting for review.
     */
    public function isWaitingReview(): bool
    {
        return $this->status === 'waiting_reviewed';
    }
}