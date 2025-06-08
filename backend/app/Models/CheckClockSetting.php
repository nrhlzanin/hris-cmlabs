<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CheckClockSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'type',
        'geo_loc',
        'office_latitude',
        'office_longitude',
        'location_radius',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => 'string',
            'office_latitude' => 'decimal:8',
            'office_longitude' => 'decimal:8',
            'location_radius' => 'integer',
        ];
    }

    /**
     * Get the check clock setting times for this setting.
     */
    public function settingTimes()
    {
        return $this->hasMany(CheckClockSettingTime::class, 'ck_settings_id');
    }

    /**
     * Scope to filter by type.
     */
    public function scopeByType($query, string $type)
    {
        return $query->where('type', $type);
    }

    /**
     * Scope to filter by name.
     */
    public function scopeByName($query, string $name)
    {
        return $query->where('name', 'like', '%' . $name . '%');
    }

    /**
     * Get the geographical coordinates as array.
     */
    public function getGeoLocationAttribute(): ?array
    {
        if (!$this->geo_loc) {
            return null;
        }

        $coords = explode(',', $this->geo_loc);
        return [
            'latitude' => trim($coords[0] ?? ''),
            'longitude' => trim($coords[1] ?? ''),
        ];
    }
}