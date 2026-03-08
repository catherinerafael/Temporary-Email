<?php

use Webklex\IMAP\Facades\Client;

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    $client = Client::account('default');
    $client->connect();
    echo "Connected.\n";
    $folder = $client->getFolder('INBOX');

    // Get ALL messages, not just unseen
    $messages = $folder->messages()->all()->limit(5, 1)->get();
    echo "Total INBOX messages (last 5): " . $messages->count() . "\n";

    foreach ($messages as $msg) {
        $to = $msg->getTo();
        $recipient = '';
        if ($to && $to->count() > 0) {
            $recipient = strtolower($to->first()->mail);
        }
        echo "- Subject: " . $msg->getSubject() . " | To: " . $recipient . " | Seen: " . ($msg->hasFlag('Seen') ? 'Yes' : 'No') . "\n";
    }
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
