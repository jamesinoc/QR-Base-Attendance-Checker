<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $students = Student::where('user_id', $request->user()->id)
            ->orderBy('id')
            ->get();

        return response()->json(['students' => $students]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'course' => ['nullable', 'string', 'max:100'],
            'year_level' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'qr_value' => ['nullable', 'string', 'max:255'],
            'active' => ['boolean'],
        ]);

        $duplicate = Student::where('user_id', $request->user()->id)
            ->where('student_id', $validated['student_id'])
            ->first();

        if ($duplicate) {
            return response()->json([
                'message' => 'A student with this ID already exists.',
            ], 422);
        }

        $student = Student::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json(['student' => $student], 201);
    }

    public function update(Request $request, Student $student): JsonResponse
    {
        if ($student->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:50'],
            'name' => ['required', 'string', 'max:255'],
            'course' => ['nullable', 'string', 'max:100'],
            'year_level' => ['nullable', 'string', 'max:50'],
            'email' => ['nullable', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:50'],
            'qr_value' => ['nullable', 'string', 'max:255'],
            'active' => ['boolean'],
        ]);

        $duplicate = Student::where('user_id', $request->user()->id)
            ->where('student_id', $validated['student_id'])
            ->where('id', '!=', $student->id)
            ->first();

        if ($duplicate) {
            return response()->json([
                'message' => 'A student with this ID already exists.',
            ], 422);
        }

        $student->update($validated);

        return response()->json(['student' => $student]);
    }

    public function destroy(Request $request, Student $student): JsonResponse
    {
        if ($student->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $student->delete();

        return response()->json(['message' => 'Student deleted.'], 200);
    }
}