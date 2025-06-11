<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
use App\Helpers\TimezoneHelper;

class Overtime extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'overtime_date',
        'start_time',
        'end_time',
        'duration_hours',
        'reason',
        'tasks_completed',
        'status',
        'approved_by',
        'approved_at',
        'admin_notes',
        'supporting_document',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'overtime_date' => 'date',
            'start_time' => 'datetime:H:i',
            'end_time' => 'datetime:H:i',
            'duration_hours' => 'decimal:2',
            'approved_at' => 'datetime',
        ];
    }

    /**
     * Get the user that owns this overtime record.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_users');
    }

    /**
     * Get the admin who approved this overtime.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'id_users');
    }

    /**
     * Scope to filter by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by status.
     */
    public function scopeByStatus($query, string $status)
    {
        return $query->where('status', $status);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeByDateRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('overtime_date', [$startDate, $endDate]);
    }

    /**
     * Scope to filter by date.
     */
    public function scopeByDate($query, string $date)
    {
        return $query->whereDate('overtime_date', $date);
    }

    /**
     * Scope to get pending overtimes.
     */
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    /**
     * Scope to get approved overtimes.
     */
    public function scopeApproved($query)
    {
        return $query->where('status', 'approved');
    }

    /**
     * Scope to get rejected overtimes.
     */
    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    /**
     * Get formatted overtime date in Jakarta timezone.
     */
    public function getFormattedDateAttribute(): string
    {
        return TimezoneHelper::formatJakarta($this->overtime_date, 'd M Y');
    }

    /**
     * Get formatted start time in Jakarta timezone.
     */
    public function getFormattedStartTimeAttribute(): string
    {
        return TimezoneHelper::formatJakarta("1970-01-01 {$this->start_time}", 'H:i');
    }

    /**
     * Get formatted end time in Jakarta timezone.
     */
    public function getFormattedEndTimeAttribute(): ?string
    {
        return $this->end_time ? TimezoneHelper::formatJakarta("1970-01-01 {$this->end_time}", 'H:i') : null;
    }

    /**
     * Get formatted approved date in Jakarta timezone.
     */
    public function getFormattedApprovedAtAttribute(): ?string
    {
        return $this->approved_at ? TimezoneHelper::formatJakarta($this->approved_at, 'd M Y, H:i') : null;
    }

    /**
     * Get supporting document URL.
     */
    public function getSupportingDocumentUrlAttribute(): ?string
    {
        return $this->supporting_document ? asset('storage/' . $this->supporting_document) : null;
    }

    /**
     * Check if overtime is pending.
     */
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    /**
     * Check if overtime is approved.
     */
    public function isApproved(): bool
    {
        return $this->status === 'approved';
    }

    /**
     * Check if overtime is rejected.
     */
    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    /**
     * Calculate overtime duration in hours.
     */
    public function calculateDuration(): ?float
    {
        if (!$this->end_time) {
            return null;
        }

        $start = Carbon::createFromFormat('H:i:s', $this->start_time);
        $end = Carbon::createFromFormat('H:i:s', $this->end_time);
        
        // Handle overnight overtime
        if ($end->lt($start)) {
            $end->addDay();
        }
        
        return $start->diffInMinutes($end) / 60;
    }

    /**
     * Get formatted overtime date in Jakarta timezone (detailed format)
     */
    public function getFormattedOvertimeDateAttribute(): string
    {
        return TimezoneHelper::formatJakarta($this->overtime_date, 'l, d F Y');
    }

    /**
     * Get formatted duration in human readable format
     */
    public function getFormattedDurationAttribute(): ?string
    {
        if (!$this->duration_hours) {
            return null;
        }
        
        return TimezoneHelper::formatDuration($this->duration_hours);
    }

    /**
     * Get timezone-aware created at
     */
    public function getJakartaCreatedAtAttribute(): string
    {
        return TimezoneHelper::formatJakarta($this->created_at, 'd M Y H:i');
    }

    /**
     * Get timezone-aware updated at
     */
    public function getJakartaUpdatedAtAttribute(): string
    {
        return TimezoneHelper::formatJakarta($this->updated_at, 'd M Y H:i');
    }
}
