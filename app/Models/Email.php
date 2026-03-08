<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Email extends Model
{
    use HasUuids;

    protected $fillable = [
        'recipient',
        'sender_name',
        'sender_email',
        'subject',
        'body_text',
        'body_html',
        'message_id',
    ];
}
