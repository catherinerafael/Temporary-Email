<?php

use App\Http\Controllers\InboxController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('home');

// API endpoint for fetching emails (AJAX polling)
Route::get('/api/emails/{email}', [InboxController::class, 'fetch'])->name('emails.fetch');

// Email detail page
Route::get('/inbox/{email}/message/{id}', [InboxController::class, 'show'])->name('inbox.show');
