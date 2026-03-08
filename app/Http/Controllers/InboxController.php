<?php

namespace App\Http\Controllers;

use App\Models\Email;
use Illuminate\Http\Request;
use Inertia\Inertia;

class InboxController extends Controller
{
    public function fetch($email)
    {
        $recipient = strtolower($email) . '@erlandak.com';

        $emails = Email::where('recipient', $recipient)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'sender_name', 'sender_email', 'subject', 'body_html', 'body_text', 'created_at']);

        return response()->json($emails);
    }

    public function show($email, $id)
    {
        $recipient = strtolower($email) . '@erlandak.com';

        $emailData = Email::where('recipient', $recipient)->findOrFail($id);

        return Inertia::render('Inbox/Show', [
            'address' => $email,
            'full_email' => $recipient,
            'emailData' => $emailData
        ]);
    }
}
