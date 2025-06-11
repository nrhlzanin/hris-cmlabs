<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CheckClock extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'user_id',
        'check_clock_type',
        'check_clock_time',
        'latitude',
        'longitude',
        'address',
        'supporting_evidence',
        'approval_status',
        'approved_by',
        'approved_at',
        'admin_notes',
        'is_manual_entry',
    ];

    /**
     * The attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'check_clock_time' => 'datetime',
            'approved_at' => 'datetime',
            'latitude' => 'decimal:8',
            'longitude' => 'decimal:8',
            'is_manual_entry' => 'boolean',
        ];
    }

    /**
     * Get the user that owns this check clock record.
     */
    public function user()
    {
        return $this->belongsTo(User::class, 'user_id', 'id_users');
    }

    /**
     * Scope to filter by user.
     */
    public function scopeByUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }

    /**
     * Scope to filter by check clock type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('check_clock_type', $type);
    }

    /**
     * Scope to filter by date.
     */
    public function scopeByDate($query, string $date)
    {
        return $query->whereDate('check_clock_time', $date);
    }

    /**
     * Scope to filter by date range.
     */
    public function scopeByDateRange($query, string $startDate, string $endDate)
    {
        return $query->whereBetween('check_clock_time', [$startDate, $endDate]);
    }

    /**
     * Scope to get today's records.
     */
    public function scopeToday($query)
    {
        return $query->whereDate('check_clock_time', today());
    }

    /**
     * Scope to get clock in records.
     */
    public function scopeClockIn($query)
    {
        return $query->where('check_clock_type', 'clock_in');
    }

    /**
     * Scope to get clock out records.
     */
    public function scopeClockOut($query)
    {
        return $query->where('check_clock_type', 'clock_out');
    }

    /**
     * Get formatted time attribute
     */
    public function getFormattedTimeAttribute(): string
    {
        return $this->check_clock_time->format('H:i:s');
    }

    /**
     * Get formatted date attribute
     */
    public function getFormattedDateAttribute(): string
    {
        return $this->check_clock_time->format('Y-m-d');
    }

    /**
     * Check if this is a clock in record
     */
    public function isClockIn(): bool
    {
        return $this->check_clock_type === 'clock_in';
    }

    /**
     * Check if this is a clock out record
     */
    public function isClockOut(): bool
    {
        return $this->check_clock_type === 'clock_out';
    }

    /**
     * Get the approver that approved/declined this record.
     */
    public function approver()
    {
        return $this->belongsTo(User::class, 'approved_by', 'id_users');
    }

    /**
     * Check if attendance is pending approval.
     */
    public function isPending(): bool
    {
        return $this->approval_status === 'pending';
    }

    /**
     * Check if attendance is approved.
     */
    public function isApproved(): bool
    {
        return $this->approval_status === 'approved';
    }

    /**
     * Check if attendance is declined.
     */
    public function isDeclined(): bool
    {
        return $this->approval_status === 'declined';
    }

    /**
     * Scope to filter by approval status.
     */
    public function scopeByApprovalStatus($query, string $status)
    {
        return $query->where('approval_status', $status);
    }

    /**
     * Scope to get pending records.
     */
    public function scopePending($query)
    {
        return $query->where('approval_status', 'pending');
    }

    /**
     * Scope to get approved records.
     */
    public function scopeApproved($query)
    {
        return $query->where('approval_status', 'approved');
    }

    /**
     * Scope to get declined records.
     */
    public function scopeDeclined($query)
    {
        return $query->where('approval_status', 'declined');
    }
}