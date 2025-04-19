<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function show()
    {
        return view('login');
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string|min:6',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return back()->withErrors(['email' => 'This email is not registered. Please register first.'])->withInput();
        }

        $remember = $request->has('remember');

        if (Auth::attempt($request->only('email', 'password'),$remember)) {
            $user = Auth::user();

            // Store user_id in session
            Session::put('user_id', $user->id);
            Session::put('user_name', $user->name);

            session()->flash('success', 'Welcome back, ' . $user->name . '!');
    
            if ($user->role === 'admin') {
                return redirect('/admin');
            }
    
            return redirect('/');
        }

        return back()->withErrors(['password' => 'Incorrect password.'])->withInput();
    }
}