<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Employee extends Model
{
    use HasFactory;

    /**
     * The primary key associated with the table.
     *
     * @var string
     */
    protected $primaryKey = 'nik';

    /**
     * Indicates if the model's ID is auto-incrementing.
     *
     * @var bool
     */
    public $incrementing = false;

    /**
     * The data type of the auto-incrementing ID.
     *
     * @var string
     */
    protected $keyType = 'string';

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'nik',
        'avatar',
        'first_name',
        'last_name',
        'mobile_phone',
        'gender',
        'last_education',
        'place_of_birth',
        'date_of_birth',
        'position',
        'branch',
        'contract_type',
        'grade',
        'bank',
        'account_number',
        'acc_holder_name',
        'letter_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'gender' => 'string',
            'last_education' => 'string',
            'contract_type' => 'string',
            'bank' => 'string',
        ];
    }

    /**
     * Get the user associated with the employee.
     */
    public function user()
    {
        return $this->hasOne(User::class, 'employee_id', 'nik');
    }

    /**
     * Get the letter format associated with the employee.
     */
    public function letterFormat()
    {
        return $this->belongsTo(LetterFormat::class, 'letter_id', 'id_letter');
    }

    /**
     * Get the full name attribute.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get the avatar URL attribute.
     */
    public function getAvatarUrlAttribute(): ?string
    {
        return $this->avatar ? asset('storage/' . $this->avatar) : null;
    }

    /**
     * Get the age based on date of birth.
     */
    public function getAgeAttribute(): int
    {
        return $this->date_of_birth->age;
    }

    /**
     * Scope to filter by gender.
     */
    public function scopeByGender($query, string $gender)
    {
        return $query->where('gender', $gender);
    }

    /**
     * Scope to filter by contract type.
     */
    public function scopeByContractType($query, string $contractType)
    {
        return $query->where('contract_type', $contractType);
    }

    /**
     * Scope to filter by branch.
     */
    public function scopeByBranch($query, string $branch)
    {
        return $query->where('branch', $branch);
    }

    /**
     * Scope to filter by position.
     */
    public function scopeByPosition($query, string $position)
    {
        return $query->where('position', $position);
    }
}