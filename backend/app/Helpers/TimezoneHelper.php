<?php

namespace App\Helpers;

use Carbon\Carbon;

class TimezoneHelper
{
    /**
     * Jakarta timezone constant
     */
    const JAKARTA_TIMEZONE = 'Asia/Jakarta';

    /**
     * Get current Jakarta time
     */
    public static function now(): Carbon
    {
        return Carbon::now(self::JAKARTA_TIMEZONE);
    }

    /**
     * Convert UTC time to Jakarta timezone
     */
    public static function toJakarta($datetime): Carbon
    {
        if (is_string($datetime)) {
            $datetime = Carbon::parse($datetime);
        }
        
        return $datetime->setTimezone(self::JAKARTA_TIMEZONE);
    }

    /**
     * Convert Jakarta time to UTC
     */
    public static function toUtc($datetime): Carbon
    {
        if (is_string($datetime)) {
            $datetime = Carbon::parse($datetime, self::JAKARTA_TIMEZONE);
        }
        
        return $datetime->utc();
    }

    /**
     * Format datetime for Jakarta timezone
     */
    public static function formatJakarta($datetime, string $format = 'Y-m-d H:i:s'): string
    {
        return self::toJakarta($datetime)->format($format);
    }

    /**
     * Format datetime for Jakarta timezone (alias for formatJakarta)
     */
    public static function formatJakartaTime($datetime, string $format = 'H:i:s'): string
    {
        return self::formatJakarta($datetime, $format);
    }

    /**
     * Format datetime for Jakarta timezone date
     */
    public static function formatJakartaDate($datetime, string $format = 'Y-m-d'): string
    {
        return self::formatJakarta($datetime, $format);
    }

    /**
     * Get Jakarta date string (Y-m-d)
     */
    public static function getJakartaDate($datetime = null): string
    {
        $date = $datetime ? self::toJakarta($datetime) : self::now();
        return $date->format('Y-m-d');
    }

    /**
     * Get Jakarta time string (H:i:s)
     */
    public static function getJakartaTime($datetime = null): string
    {
        $time = $datetime ? self::toJakarta($datetime) : self::now();
        return $time->format('H:i:s');
    }

    /**
     * Check if date is today in Jakarta timezone
     */
    public static function isToday($date): bool
    {
        $today = self::now()->format('Y-m-d');
        $checkDate = is_string($date) ? $date : self::getJakartaDate($date);
        
        return $today === $checkDate;
    }

    /**
     * Get working hours in Jakarta timezone
     */
    public static function getWorkingHours(): array
    {
        return [
            'start' => '08:00',
            'end' => '17:00',
            'overtime_start' => '18:00'
        ];
    }

    /**
     * Check if current time is within working hours
     */
    public static function isWorkingHours(): bool
    {
        $now = self::now();
        $workingHours = self::getWorkingHours();
        
        $currentTime = $now->format('H:i');
        
        return $currentTime >= $workingHours['start'] && $currentTime <= $workingHours['end'];
    }

    /**
     * Check if current time is overtime period
     */
    public static function isOvertimeHours(): bool
    {
        $now = self::now();
        $workingHours = self::getWorkingHours();
        
        $currentTime = $now->format('H:i');
        
        return $currentTime >= $workingHours['overtime_start'];
    }

    /**
     * Calculate duration between two times in hours
     */
    public static function calculateDurationHours($startTime, $endTime): float
    {
        $start = is_string($startTime) ? Carbon::parse($startTime) : $startTime;
        $end = is_string($endTime) ? Carbon::parse($endTime) : $endTime;
        
        return $end->diffInHours($start, true);
    }

    /**
     * Format duration in human readable format
     */
    public static function formatDuration(float $hours): string
    {
        $wholeHours = floor($hours);
        $minutes = round(($hours - $wholeHours) * 60);
        
        if ($wholeHours > 0 && $minutes > 0) {
            return "{$wholeHours} jam {$minutes} menit";
        } elseif ($wholeHours > 0) {
            return "{$wholeHours} jam";
        } else {
            return "{$minutes} menit";
        }
    }

    /**
     * Get timezone info for frontend
     */
    public static function getTimezoneInfo(): array
    {
        $now = self::now();
        
        return [
            'timezone' => self::JAKARTA_TIMEZONE,
            'offset' => '+07:00',
            'current_time' => $now->toISOString(),
            'current_date' => $now->format('Y-m-d'),
            'current_time_string' => $now->format('H:i:s'),
            'is_working_hours' => self::isWorkingHours(),
            'is_overtime_hours' => self::isOvertimeHours(),
            'working_hours' => self::getWorkingHours()
        ];
    }
}
