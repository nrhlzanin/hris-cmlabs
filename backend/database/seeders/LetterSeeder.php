<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Letter;
use App\Models\LetterHistory;
use App\Models\LetterFormat;
use Carbon\Carbon;

class LetterSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // First, ensure we have letter formats
        $letterFormat = LetterFormat::first();
        if (!$letterFormat) {
            // Create a letter format if none exists
            $letterFormat = LetterFormat::create([
                'name_letter' => 'Surat Sakit',
                'content' => 'templates/surat-sakit.docx',
                'status' => 'active',
            ]);
        }

        // Sample letters data
        $lettersData = [
            [
                'name_letter_id' => $letterFormat->id_letter,
                'employee_name' => 'Puma Pumi',
                'name' => 'Surat Sakit',
                'letter_type' => 'Absensi',
                'status' => 'waiting_reviewed',
                'valid_until' => Carbon::now()->addDays(30),
                'description' => 'Surat izin sakit karena demam tinggi',
                'supporting_document' => null,
            ],
            [
                'name_letter_id' => $letterFormat->id_letter,
                'employee_name' => 'Dika Dikut',
                'name' => 'Surat Sakit',
                'letter_type' => 'Absensi',
                'status' => 'approved',
                'valid_until' => Carbon::now()->addDays(30),
                'description' => 'Surat izin sakit karena flu',
                'supporting_document' => null,
            ],
            [
                'name_letter_id' => $letterFormat->id_letter,
                'employee_name' => 'Anin Pulu-Pulu',
                'name' => 'Surat Sakit',
                'letter_type' => 'Absensi',
                'status' => 'declined',
                'valid_until' => Carbon::now()->addDays(30),
                'description' => 'Surat izin sakit',
                'supporting_document' => null,
            ],
        ];

        foreach ($lettersData as $letterData) {
            $letter = Letter::create($letterData);

            // Create history entries
            if ($letter->status === 'waiting_reviewed') {
                // Create multiple history entries for the first letter
                $histories = [
                    [
                        'status' => 'pending',
                        'description' => 'Letter created',
                        'actor' => 'System',
                        'created_at' => Carbon::now()->subDays(5),
                    ],
                    [
                        'status' => 'waiting_reviewed',
                        'description' => 'Sakit Hati Pak',
                        'actor' => 'Puma Pumi',
                        'created_at' => Carbon::now()->subDays(3),
                    ],
                ];

                foreach ($histories as $historyData) {
                    $letter->histories()->create($historyData);
                }
            } elseif ($letter->status === 'approved') {
                // Create history for approved letter
                $histories = [
                    [
                        'status' => 'pending',
                        'description' => 'Letter created',
                        'actor' => 'System',
                        'created_at' => Carbon::now()->subDays(10),
                    ],
                    [
                        'status' => 'waiting_reviewed',
                        'description' => 'Waiting for admin approval',
                        'actor' => 'Dika Dikut',
                        'created_at' => Carbon::now()->subDays(8),
                    ],
                    [
                        'status' => 'approved',
                        'description' => 'Letter approved by admin',
                        'actor' => 'Admin',
                        'created_at' => Carbon::now()->subDays(5),
                    ],
                ];

                foreach ($histories as $historyData) {
                    $letter->histories()->create($historyData);
                }
            } elseif ($letter->status === 'declined') {
                // Create history for declined letter
                $histories = [
                    [
                        'status' => 'pending',
                        'description' => 'Letter created',
                        'actor' => 'System',
                        'created_at' => Carbon::now()->subDays(15),
                    ],
                    [
                        'status' => 'waiting_reviewed',
                        'description' => 'Waiting for admin approval',
                        'actor' => 'Anin Pulu-Pulu',
                        'created_at' => Carbon::now()->subDays(12),
                    ],
                    [
                        'status' => 'declined',
                        'description' => 'Insufficient supporting documents',
                        'actor' => 'Admin',
                        'created_at' => Carbon::now()->subDays(10),
                    ],
                ];

                foreach ($histories as $historyData) {
                    $letter->histories()->create($historyData);
                }
            }
        }
    }
}
