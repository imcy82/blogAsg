<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\BlogController;
use App\Http\Controllers\TempImageController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('blogs',[BlogController::class, 'index']);
Route::get('blogs/{id}',[BlogController::class, 'show']);
Route::post('blog',[BlogController::class, 'store']);
Route::post('save-temp-image',[TempImageController::class, 'store']);
Route::put('blogs/{id}',[BlogController::class, 'update']);
Route::delete('blogs/{id}',[BlogController::class, 'destroy']);
/*
Route::middleware('auth:sanctum')->group(function () {
    Route::get('blogs', [BlogController::class, 'index']);
    Route::get('blogs/{id}', [BlogController::class, 'show']);
    Route::post('blog', [BlogController::class, 'store']);
    Route::put('blogs/{id}', [BlogController::class, 'update']);
    Route::delete('blogs/{id}', [BlogController::class, 'destroy']);
});
*/
// Route::middleware('auth:sanctum')->get('/permissions', function (Request $request) {
//     return response()->json([
//         'canCreateBlog' => $request->user()->can('create', \App\Models\Blog::class),
//         'canViewAnyBlog' => $request->user()->can('viewAny', \App\Models\Blog::class),
//     ]);
// });
