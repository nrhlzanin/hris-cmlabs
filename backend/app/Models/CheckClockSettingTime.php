<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckClockSettingTime extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'ck_settings_id',
        'clock_in',
        'clock_out',
        'break_start',
        'break_end',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'clock_in' => 'datetime:H:i',
            'clock_out' => 'datetime:H:i',
            'break_start' => 'datetime:H:i',
            'break_end' => 'datetime:H:i',
        ];
    }

    /**
     * Get the check clock setting that owns this time setting.
     */
    public function checkClockSetting()
    {
        return $this->belongsTo(CheckClockSetting::class, 'ck_settings_id');
    }

    /**
     * Get the total work hours for the day.
     */
    public function getTotalWorkHoursAttribute(): float
    {
        $clockIn = \Carbon\Carbon::createFromFormat('H:i:s', $this->clock_in);
        $clockOut = \Carbon\Carbon::createFromFormat('H:i:s', $this->clock_out);
        $breakStart = \Carbon\Carbon::createFromFormat('H:i:s', $this->break_start);
        $breakEnd = \Carbon\Carbon::createFromFormat('H:i:s', $this->break_end);

        $totalMinutes = $clockOut->diffInMinutes($clockIn);
        $breakMinutes = $breakEnd->diffInMinutes($breakStart);

        return ($totalMinutes - $breakMinutes) / 60;
    }

    /**
     * Get the break duration in minutes.
     */
    public function getBreakDurationAttribute(): int
    {
        $breakStart = \Carbon\Carbon::createFromFormat('H:i:s', $this->break_start);
        $breakEnd = \Carbon\Carbon::createFromFormat('H:i:s', $this->break_end);

        return $breakEnd->diffInMinutes($breakStart);
    }
}