<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Student;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    private const PRESENT_WINDOW_MINUTES = 15;

    private const LATE_WINDOW_MINUTES = 30;

    /**
     * Derive a Present/Late/Absent status from a scan time (HH:MM)
     * relative to the scheduled class start time (HH:MM).
     */
    private function computeStatus(string $scanTime, string $startTime): string
    {
        $scanMinutes = $this->toMinutes($scanTime);
        $startMinutes = $this->toMinutes($startTime);
        $diff = $scanMinutes - $startMinutes;

        if ($diff >= 0 && $diff <= self::PRESENT_WINDOW_MINUTES) {
            return 'Present';
        }

        if ($diff > self::PRESENT_WINDOW_MINUTES && $diff <= self::LATE_WINDOW_MINUTES) {
            return 'Late';
        }

        return 'Absent';
    }

    private function toMinutes(string $value): int
    {
        [$hours, $minutes] = array_map('intval', explode(':', $value));

        return $hours * 60 + $minutes;
    }

    public function index(Request $request): JsonResponse
    {
        $records = AttendanceRecord::where('user_id', $request->user()->id)
            ->orderByDesc('date')
            ->orderByDesc('id')
            ->get();

        return response()->json(['attendance' => $records]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'student_id' => ['required', 'string', 'max:50'],
            'student_name' => ['required', 'string', 'max:255'],
            'class_code' => ['nullable', 'string', 'max:100'],
            'class_name' => ['required', 'string', 'max:255'],
            'subject' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date_format:Y-m-d'],
            'time' => ['required', 'string', 'max:5'],
            'status' => ['required', 'in:Present,Late,Absent'],
            'method' => ['nullable', 'in:QR Scan,Manual,Auto'],
            'start_time' => ['nullable', 'date_format:H:i'],
            'end_time' => ['nullable', 'date_format:H:i'],
        ]);

        // When a class start time is provided, the server derives the
        // status from the exact scan time so the result is authoritative.
        if (! empty($validated['start_time'])) {
            $validated['status'] = $this->computeStatus(
                $validated['time'],
                $validated['start_time'],
            );
        } else {
            $validated['start_time'] = null;
        }

        if (empty($validated['end_time'])) {
            $validated['end_time'] = null;
        }

        $existing = AttendanceRecord::where('user_id', $request->user()->id)
            ->where('student_id', $validated['student_id'])
            ->where('class_name', $validated['class_name'])
            ->where('subject', $validated['subject'])
            ->where('date', $validated['date'])
            ->first();

        if ($existing) {
            return response()->json([
                'attendance' => $existing,
                'created' => false,
            ]);
        }

        $record = AttendanceRecord::create([
            'user_id' => $request->user()->id,
            ...$validated,
        ]);

        return response()->json([
            'attendance' => $record,
            'created' => true,
        ], 201);
    }

    public function update(Request $request, AttendanceRecord $attendance): JsonResponse
    {
        if ($attendance->user_id !== $request->user()->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        $validated = $request->validate([
            'status' => ['required', 'in:Present,Late,Absent'],
        ]);

        $attendance->update($validated);

        return response()->json(['attendance' => $attendance]);
    }

    public function reset(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        AttendanceRecord::where('user_id', $userId)->delete();
        Student::where('user_id', $userId)->delete();

        return response()->json(['message' => 'All data reset.']);
    }
}