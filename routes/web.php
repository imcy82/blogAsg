<?php

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RegisterController;
use App\Http\Controllers\LoginController;
use Illuminate\Http\Request;
use App\Http\Controllers\CommentController;

Route::get('/register', [RegisterController::class, 'show'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);

Route::get('/login', [LoginController::class, 'show'])->name('login');
Route::post('/login', [LoginController::class, 'login']);

Route::get('/', function () {
    return view('welcome');
});

use Illuminate\Support\Facades\Gate;

Route::get('/admin', function () {
    if (Gate::allows('access-admin')) {
        return view('welcome'); 
    }
    abort(403, 'Unauthorized access.');
})->middleware('auth');


// Logout route
Route::post('/logout', function (Request $request) {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/')->with('success', 'You have been logged out.');
})->name('logout');


// CRUD
// Route::get('/blogs', function() {
//     return view('blogs');
// });
Route::get('/create-blog', function() {
    return view('createBlog');
});
Route::get('/blog-detail/{id}', function($id) {
    return view('blogDetail', ['id' => $id]);
});

Route::get('/user-info', function () {
    return response()->json([
        'id' => session('user_id'),
        'name' => session('user_name'),
    ]);
});

Route::get('/blog/edit/{id}', function($id) {
    return view('updateBlog', ['id' => $id]);
}); 

//comment
//Route::get('/blogs/{id}/comments', [CommentController::class, 'store']);
//Route::get('/blog/{id}/comments',[CommentController::class, 'show']);