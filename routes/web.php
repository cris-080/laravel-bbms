<?php

use App\Http\Controllers\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Password;

// Temporary Developer Route: Safely generate a real token and redirect
Route::get('/dev/generate-reset-token', function (\Illuminate\Http\Request $request) {
    $email = $request->query('email');
    $user = User::where('email', $email)->first();
    
    if (!$user) {
        return redirect('/login')->withErrors(['email' => 'User not found.']);
    }

    $token =  Password::broker()->createToken($user);
    return redirect('/reset-password/' . $token . '?email=' . urlencode($email));
});

// Redirect root: send authenticated users to dashboard, guests to login
Route::get('/', function () {
    return auth()->check() ? redirect()->route('dashboard') : redirect()->route('login');
});

// Guest routes (Laravel automatically redirects authenticated users to /dashboard)
Route::middleware('guest')->group(function () {
    Route::get('/login', function () {
        return Inertia::render('Auth/Login');
    })->name('login');
});

// Protected routes (require login)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
});

// Modular Routes
require __DIR__.'/inventory.php';
require __DIR__.'/donations.php';
require __DIR__.'/audits.php';
require __DIR__.'/donors.php';
require __DIR__.'/blood-requests.php';
require __DIR__.'/users.php';
require __DIR__.'/schedules.php';
require __DIR__.'/profile.php';