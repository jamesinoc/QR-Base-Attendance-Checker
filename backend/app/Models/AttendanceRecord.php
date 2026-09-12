<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

#[Fillable([
    'user_id',
    'student_id',
    'student_name',
    'class_code',
    'class_name',
    'subject',
    'date',
    'time',
    'status',
    'method',
    'start_time',
    'end_time',
])]
class AttendanceRecord extends Model
{
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}