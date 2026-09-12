<?php

namespace Tests\Feature;

use App\Models\AttendanceRecord;
use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class AttendanceTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/attendance')->assertStatus(401);
    }

    public function test_an_authenticated_user_can_create_an_attendance_record(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance', [
            'student_id' => '20250001',
            'student_name' => 'Juan Dela Cruz',
            'class_code' => 'BSIT3A',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:05',
            'status' => 'Present',
            'method' => 'QR Scan',
            'start_time' => '08:00',
            'end_time' => '10:00',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('created', true)
            ->assertJsonPath('attendance.status', 'Present')
            ->assertJsonPath('attendance.start_time', '08:00')
            ->assertJsonPath('attendance.end_time', '10:00');

        $this->assertDatabaseCount('attendance_records', 1);
    }

    public function test_status_is_computed_from_start_time(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $payload = [
            'student_id' => '20250001',
            'student_name' => 'Juan Dela Cruz',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:10',
            'status' => 'Present',
            'method' => 'QR Scan',
            'start_time' => '08:00',
        ];

        // Within the 15-minute present window.
        $present = $this->postJson('/api/attendance', $payload);

        $present->assertStatus(201)
            ->assertJsonPath('attendance.status', 'Present');
    }

    public function test_late_status_is_computed_from_start_time(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance', [
            'student_id' => '20250002',
            'student_name' => 'Maria Santos',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:20',
            'status' => 'Present',
            'method' => 'Manual',
            'start_time' => '08:00',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('attendance.status', 'Late');

        $this->assertDatabaseHas('attendance_records', [
            'student_id' => '20250002',
            'status' => 'Late',
        ]);
    }

    public function test_scan_after_late_window_is_absent(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance', [
            'student_id' => '20250003',
            'student_name' => 'Ana Reyes',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:35',
            'status' => 'Present',
            'method' => 'Manual',
            'start_time' => '08:00',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('attendance.status', 'Absent');
    }

    public function test_scan_before_class_start_is_absent(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance', [
            'student_id' => '20250004',
            'student_name' => 'Ben Cruz',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '07:50',
            'status' => 'Present',
            'method' => 'Manual',
            'start_time' => '08:00',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('attendance.status', 'Absent');
    }

    public function test_manual_entry_without_start_time_preserves_status(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/attendance', [
            'student_id' => '20250005',
            'student_name' => 'Carla Lim',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '09:00',
            'status' => 'Absent',
            'method' => 'Manual',
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('attendance.status', 'Absent')
            ->assertJsonPath('attendance.start_time', null)
            ->assertJsonPath('attendance.end_time', null);
    }

    public function test_a_duplicate_scan_updates_instead_of_duplicating(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $payload = [
            'student_id' => '20250001',
            'student_name' => 'Juan Dela Cruz',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:05',
            'status' => 'Late',
            'method' => 'QR Scan',
        ];

        $this->postJson('/api/attendance', $payload)->assertStatus(201);

        $second = $this->postJson('/api/attendance', [
            ...$payload,
            'time' => '08:20',
        ]);

        $second->assertOk()
            ->assertJsonPath('created', false)
            ->assertJsonPath('attendance.status', 'Late');

        $this->assertDatabaseCount('attendance_records', 1);
    }

    public function test_invalid_status_is_rejected(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/attendance', [
            'student_id' => '20250001',
            'student_name' => 'Juan Dela Cruz',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:05',
            'status' => 'Unknown',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('status');
    }

    public function test_invalid_method_is_rejected(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $this->postJson('/api/attendance', [
            'student_id' => '20250001',
            'student_name' => 'Juan Dela Cruz',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Development',
            'date' => '2026-09-11',
            'time' => '08:05',
            'status' => 'Present',
            'method' => 'Magic',
        ])->assertStatus(422)
            ->assertJsonValidationErrors('method');
    }

    public function test_list_is_scoped_to_the_authenticated_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        AttendanceRecord::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'student_name' => 'Mine',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Dev',
            'date' => '2026-09-11',
            'time' => '08:00',
            'status' => 'Present',
            'method' => 'QR Scan',
        ]);

        AttendanceRecord::create([
            'user_id' => $other->id,
            'student_id' => '20250002',
            'student_name' => 'Theirs',
            'class_name' => 'BSIT 4A',
            'subject' => 'Networking',
            'date' => '2026-09-11',
            'time' => '09:00',
            'status' => 'Absent',
            'method' => 'Manual',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/attendance')->assertOk();

        $this->assertCount(1, $response->json('attendance'));
        $this->assertEquals('20250001', $response->json('attendance.0.student_id'));
    }

    public function test_a_user_can_update_an_attendance_status(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $record = AttendanceRecord::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'student_name' => 'Juan',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Dev',
            'date' => '2026-09-11',
            'time' => '08:00',
            'status' => 'Late',
            'method' => 'QR Scan',
        ]);

        $response = $this->putJson("/api/attendance/{$record->id}", [
            'status' => 'Absent',
        ]);

        $response->assertOk()
            ->assertJsonPath('attendance.status', 'Absent');

        $this->assertDatabaseHas('attendance_records', [
            'id' => $record->id,
            'status' => 'Absent',
        ]);
    }

    public function test_a_user_cannot_update_another_users_attendance(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Sanctum::actingAs($user);

        $record = AttendanceRecord::create([
            'user_id' => $other->id,
            'student_id' => '20250001',
            'student_name' => 'Their Record',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Dev',
            'date' => '2026-09-11',
            'time' => '08:00',
            'status' => 'Present',
            'method' => 'QR Scan',
        ]);

        $this->putJson("/api/attendance/{$record->id}", [
            'status' => 'Absent',
        ])->assertStatus(403);
    }

    public function test_reset_removes_only_the_authenticated_users_data(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Sanctum::actingAs($user);

        Student::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'name' => 'Mine',
            'qr_value' => '20250001',
        ]);

        AttendanceRecord::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'student_name' => 'Mine',
            'class_name' => 'BSIT 3A',
            'subject' => 'Web Dev',
            'date' => '2026-09-11',
            'time' => '08:00',
            'status' => 'Present',
            'method' => 'QR Scan',
        ]);

        Student::create([
            'user_id' => $other->id,
            'student_id' => '20250002',
            'name' => 'Theirs',
            'qr_value' => '20250002',
        ]);

        AttendanceRecord::create([
            'user_id' => $other->id,
            'student_id' => '20250002',
            'student_name' => 'Theirs',
            'class_name' => 'BSIT 4A',
            'subject' => 'Networking',
            'date' => '2026-09-11',
            'time' => '09:00',
            'status' => 'Absent',
            'method' => 'Manual',
        ]);

        $this->postJson('/api/reset')->assertOk();

        $this->assertDatabaseMissing('students', ['user_id' => $user->id]);
        $this->assertDatabaseMissing('attendance_records', ['user_id' => $user->id]);

        $this->assertDatabaseHas('students', ['user_id' => $other->id]);
        $this->assertDatabaseHas('attendance_records', ['user_id' => $other->id]);
    }
}