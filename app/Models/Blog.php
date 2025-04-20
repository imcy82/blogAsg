<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use App\Models\User;

class Blog extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'shortDescription', 'image','description', 'author','user_id'];

    public function user() {
        return $this->belongsTo(User::class);
    }
    public function comments()
    {
        return $this->hasMany(Comments::class);
    }
}
