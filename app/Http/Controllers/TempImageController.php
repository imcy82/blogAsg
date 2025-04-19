<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\TempImage;

class TempImageController extends Controller
{
    public function store(Request $request) {
        //Apply validation
        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix errors',
                'errors' => $validator->errors(),
            ]);
        }

        // Upload Image here
        $image = $request->image;
        $ext = $image->getClientOriginalExtension();
        $imageName = time().'.'.$ext;

        // Store Image info in database
        $tempImage = new TempImage();
        $tempImage->name = $imageName;
        $tempImage->save();

        // Move image in temp dir
        $image->move(public_path('uploads/temp'), $imageName);

        return response()->json([
            'status' => true,
            'message' => 'Image uploaded successfully.',
            'image' => $tempImage,
        ]);
    }
}
