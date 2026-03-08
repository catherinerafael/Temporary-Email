<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Email;
use Carbon\Carbon;

class CleanupEmails extends Command
{
    protected $signature = 'email:cleanup {--days=7 : Delete emails older than N days}';
    protected $description = 'Delete old emails from the database';

    public function handle()
    {
        $days = (int) $this->option('days');
        $cutoff = Carbon::now()->subDays($days);

        $count = Email::where('created_at', '<', $cutoff)->count();

        if ($count === 0) {
            $this->info("No emails older than {$days} days found.");
            return;
        }

        Email::where('created_at', '<', $cutoff)->delete();
        $this->info("Deleted {$count} emails older than {$days} days.");
    }
}
