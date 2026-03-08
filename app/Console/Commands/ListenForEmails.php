<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Webklex\IMAP\Facades\Client;
use App\Models\Email;
use Illuminate\Support\Str;

class ListenForEmails extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'email:listen';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Listen for incoming emails using IMAP IDLE';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info("Connecting to IMAP server...");

        try {
            /** @var \Webklex\PHPIMAP\Client $client */
            $client = Client::account('default');
            $client->connect();

            $this->info("Connected successfully. Looking for INBOX...");
            $folder = $client->getFolder('INBOX');

            $this->info("Starting continuous polling mode...");

            while (true) {
                // Get all messages and process them
                $messages = $folder->query()->all()->get();

                if ($messages->count() > 0) {
                    $this->info("Found " . $messages->count() . " new emails.");
                    foreach ($messages as $message) {
                        $this->processMessage($message);
                    }
                }

                // Wait for 5 seconds before checking again
                sleep(1);
            }

        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
    }

    protected function processMessage($message)
    {
        $this->info("Processing email: " . $message->getSubject());

        // Attempt to parse recipient
        $to = $message->getTo();
        $recipient = '';
        if ($to && $to->count() > 0) {
            $recipient = strtolower($to->first()->mail);
        }

        // Attempt to parse sender
        $from = $message->getFrom();
        $senderName = '';
        $senderEmail = '';
        if ($from && $from->count() > 0) {
            $senderName = $from->first()->personal;
            $senderEmail = strtolower($from->first()->mail);
        }

        // Save to Database
        Email::create([
            'id' => (string) Str::uuid(),
            'recipient' => $recipient,
            'sender_name' => $senderName,
            'sender_email' => $senderEmail,
            'subject' => $message->getSubject(),
            'body_text' => $message->getTextBody(),
            'body_html' => $message->getHTMLBody(),
            'message_id' => $message->getMessageId(),
        ]);

        $this->info("Saved email to database for recipient: {$recipient}");

        // Set message as seen and delete
        $message->setFlag(['Seen']);
        $message->delete();
        $this->info("Deleted processed email from server.");
    }
}
