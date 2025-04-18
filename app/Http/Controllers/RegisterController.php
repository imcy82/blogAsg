<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class RegisterController extends Controller
{
    public function show()
    {
        return view('register');
    }

    public function register(Request $request)
    {
        $request->validate([
            'name'=>'required|string|max:255',
            'email'=>'required|string|email|unique:users',
            'password'=>'required|string|min:6|confirmed',
            'role' => 'required|in:user,admin',
        ]);

        $role = $request->input('role');

        // If registering as admin, check referral code
        if ($role === 'admin') {
            $referral = $request->input('referral_code');

        if ($referral !== '45blog') {
            return back()
                ->withErrors(['referral_code' => 'Incorrect referral code. If you are a user, please return to register as a member.'])
                ->withInput();
        }
    }
       // Create user
        $user = \App\Models\User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => $role,
        ]);

        auth()->login($user);

        // Redirect based on role
        if ($user->role === 'admin') {
            return redirect('/admin')->with('success', 'Welcome, Admin ' . $user->name . '!');
        }

        return redirect('/')->with('success', 'Welcome, ' . $user->name . '!');
    }
}
