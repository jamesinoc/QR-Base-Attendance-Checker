<?php

namespace Tests\Feature;

use App\Models\Student;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class StudentTest extends TestCase
{
    use RefreshDatabase;

    public function test_unauthenticated_requests_are_rejected(): void
    {
        $this->getJson('/api/students')->assertStatus(401);

        $this->postJson('/api/students', [
            'student_id' => '20250001',
            'name' => 'Juan',
        ])->assertStatus(401);
    }

    public function test_an_authenticated_user_can_create_a_student(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $response = $this->postJson('/api/students', [
            'student_id' => '20250001',
            'name' => 'Juan Dela Cruz',
            'course' => 'BSIT',
            'year_level' => '1st Year',
            'email' => 'juan@example.com',
            'phone' => '09171234567',
            'qr_value' => '20250001',
            'active' => true,
        ]);

        $response->assertStatus(201)
            ->assertJsonPath('student.student_id', '20250001');

        $this->assertDatabaseHas('students', [
            'user_id' => $user->id,
            'student_id' => '20250001',
            'name' => 'Juan Dela Cruz',
        ]);
    }

    public function test_duplicate_student_ids_are_rejected(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        Student::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'name' => 'Original',
            'qr_value' => '20250001',
        ]);

        $response = $this->postJson('/api/students', [
            'student_id' => '20250001',
            'name' => 'Duplicate',
            'qr_value' => '20250001',
        ]);

        $response->assertStatus(422)
            ->assertJsonPath(
                'message',
                'A student with this ID already exists.'
            );

        $this->assertDatabaseCount('students', 1);
    }

    public function test_duplicate_student_ids_are_allowed_across_users(): void
    {
        $first = User::factory()->create();
        $second = User::factory()->create();

        Sanctum::actingAs($first);

        $this->postJson('/api/students', [
            'student_id' => '20250001',
            'name' => 'First User Student',
            'qr_value' => '20250001',
        ])->assertStatus(201);

        Sanctum::actingAs($second);

        $this->postJson('/api/students', [
            'student_id' => '20250001',
            'name' => 'Second User Student',
            'qr_value' => '20250001',
        ])->assertStatus(201);

        $this->assertDatabaseCount('students', 2);
    }

    public function test_list_is_scoped_to_the_authenticated_user(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Student::create([
            'user_id' => $user->id,
            'student_id' => 'AAA',
            'name' => 'Mine',
            'qr_value' => 'AAA',
        ]);

        Student::create([
            'user_id' => $other->id,
            'student_id' => 'BBB',
            'name' => 'Theirs',
            'qr_value' => 'BBB',
        ]);

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/students')->assertOk();

        $this->assertCount(1, $response->json('students'));
        $this->assertEquals('AAA', $response->json('students.0.student_id'));
    }

    public function test_a_user_can_update_their_own_student(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $student = Student::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'name' => 'Before',
            'qr_value' => '20250001',
        ]);

        $response = $this->putJson("/api/students/{$student->id}", [
            'student_id' => '20250001',
            'name' => 'After',
            'qr_value' => '20250001',
        ]);

        $response->assertOk()
            ->assertJsonPath('student.name', 'After');

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'name' => 'After',
        ]);
    }

    public function test_a_user_cannot_update_another_users_student(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Sanctum::actingAs($user);

        $student = Student::create([
            'user_id' => $other->id,
            'student_id' => '20250001',
            'name' => 'Theirs',
            'qr_value' => '20250001',
        ]);

        $this->putJson("/api/students/{$student->id}", [
            'student_id' => '20250099',
            'name' => 'Hacked',
            'qr_value' => '20250099',
        ])->assertStatus(403);

        $this->assertDatabaseHas('students', [
            'id' => $student->id,
            'name' => 'Theirs',
        ]);
    }

    public function test_a_user_can_delete_their_own_student(): void
    {
        $user = User::factory()->create();

        Sanctum::actingAs($user);

        $student = Student::create([
            'user_id' => $user->id,
            'student_id' => '20250001',
            'name' => 'Mine',
            'qr_value' => '20250001',
        ]);

        $this->deleteJson("/api/students/{$student->id}")->assertOk();

        $this->assertDatabaseMissing('students', ['id' => $student->id]);
    }

    public function test_a_user_cannot_delete_another_users_student(): void
    {
        $user = User::factory()->create();
        $other = User::factory()->create();

        Sanctum::actingAs($user);

        $student = Student::create([
            'user_id' => $other->id,
            'student_id' => '20250001',
            'name' => 'Theirs',
            'qr_value' => '20250001',
        ]);

        $this->deleteJson("/api/students/{$student->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('students', ['id' => $student->id]);
    }
}