<?php

namespace Database\Seeders;

use App\Models\AttendanceRecord;
use App\Models\Student;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $testUser = User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);

        $teacher = User::create([
            'name' => 'Teacher Demo',
            'email' => 'teacher@example.com',
            'school' => 'Sample University',
            'password' => Hash::make('password'),
        ]);

        $students = [
            ['20240001', 'Juan Dela Cruz', 'BSIT', '3rd Year', 'juan.delacruz@example.com', '09171234567'],
            ['20240002', 'Maria Santos', 'BSIT', '3rd Year', 'maria.santos@example.com', '09171234568'],
            ['20240003', 'Carlos Ramirez', 'BSIT', '3rd Year', 'carlos.ramirez@example.com', '09171234569'],
            ['20240004', 'Ana Reyes', 'BSIT', '3rd Year', 'ana.reyes@example.com', '09171234570'],
            ['20240005', 'Pedro Garcia', 'BSCS', '2nd Year', 'pedro.garcia@example.com', '09171234571'],
            ['20240006', 'Sofia Mendoza', 'BSCS', '2nd Year', 'sofia.mendoza@example.com', '09171234572'],
            ['20240007', 'Luis Torres', 'BSIT', '3rd Year', 'luis.torres@example.com', '09171234573'],
            ['20240008', 'Elena Navarro', 'BSIS', '3rd Year', 'elena.navarro@example.com', '09171234574'],
            ['20240009', 'Miguel Flores', 'BSIT', '3rd Year', 'miguel.flores@example.com', '09171234575'],
            ['20240010', 'Isabella Cruz', 'BSEd', '2nd Year', 'isabella.cruz@example.com', '09171234576'],
        ];

        foreach ($students as [$studentId, $name, $course, $yearLevel, $email, $phone]) {
            Student::create([
                'user_id' => $teacher->id,
                'student_id' => $studentId,
                'name' => $name,
                'course' => $course,
                'year_level' => $yearLevel,
                'email' => $email,
                'phone' => $phone,
                'qr_value' => $studentId,
                'active' => true,
            ]);
        }

        $date = now()->addHours(8)->toDateString();

        $records = [
            ['20240001', 'Juan Dela Cruz', '08:01', 'Present', 'QR Scan'],
            ['20240002', 'Maria Santos', '08:05', 'Present', 'QR Scan'],
            ['20240003', 'Carlos Ramirez', '08:18', 'Late', 'Manual'],
            ['20240004', 'Ana Reyes', '08:02', 'Present', 'QR Scan'],
            ['20240005', 'Pedro Garcia', '08:25', 'Late', 'Manual'],
            ['20240006', 'Sofia Mendoza', '08:03', 'Present', 'QR Scan'],
            ['20240007', 'Luis Torres', '08:10', 'Present', 'QR Scan'],
            ['20240008', 'Elena Navarro', '08:35', 'Absent', 'Auto'],
            ['20240009', 'Miguel Flores', '08:40', 'Absent', 'Auto'],
            ['20240010', 'Isabella Cruz', '08:12', 'Present', 'QR Scan'],
        ];

        foreach ($records as [$studentId, $studentName, $time, $status, $method]) {
            AttendanceRecord::create([
                'user_id' => $teacher->id,
                'student_id' => $studentId,
                'student_name' => $studentName,
                'class_code' => 'BSIT3A',
                'class_name' => 'BSIT 3A',
                'subject' => 'Web Development',
                'date' => $date,
                'time' => $time,
                'status' => $status,
                'method' => $method,
                'start_time' => '08:00',
                'end_time' => '10:00',
            ]);
        }
    }
}