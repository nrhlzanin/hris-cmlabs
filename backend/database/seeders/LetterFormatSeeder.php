<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\LetterFormat;

class LetterFormatSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $letterFormats = [
            [
                'name_letter' => 'Surat Sakit',
                'content' => 'templates/surat-sakit.docx',
                'status' => 'active',
            ],
            [
                'name_letter' => 'Surat Izin',
                'content' => 'templates/surat-izin.docx',
                'status' => 'active',
            ],
            [
                'name_letter' => 'Surat Cuti',
                'content' => 'templates/surat-cuti.docx',
                'status' => 'active',
            ],
            [
                'name_letter' => 'Surat Keterangan Kerja',
                'content' => 'templates/surat-keterangan-kerja.docx',
                'status' => 'active',
            ],
        ];

        foreach ($letterFormats as $format) {
            LetterFormat::create($format);
        }
    }
}
