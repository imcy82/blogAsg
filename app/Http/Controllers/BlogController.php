<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\File;
use App\Models\Blog;
use App\Models\TempImage;

class BlogController extends Controller
{
    // return all blogs
    /*public function index() {
        $blogs = Blog::orderBy('created_at','DESC')->get();

        return response()->json([
            'status' => true,
            'data' => $blogs,
        ]);
    }*/
    
    //return blogs by filtering
    public function index(Request $request)
    {
        $query = Blog::query();

        if ($request->has('keyword') && $request->has('searchBy')) {
            $column = $request->searchBy;

            if (in_array($column, ['title', 'author', 'date'])) {
                if ($column === 'date') {
                    $query->whereDate('created_at', $request->keyword);
                } elseif ($column === 'author') {
                    $query->whereHas('user', function ($q) use ($request) {
                        $q->where('name', 'like', '%' . $request->keyword . '%');
                    });
                } else {
                    $query->where($column, 'like', '%' . $request->keyword . '%');
                }
            }
        }

        return response()->json([
            'status' => true,
            'data' => $query->get()
        ]);
    }


    //return a single blog
    public function show($id) {
        $blog = Blog::find($id);

        if ($blog == null) {
            return response()->json([
                'status' => false,
                'message' => 'Blog not found',
            ]);
        }

        $blog['date'] = \Carbon\Carbon::parse($blog->created_at)->format('d M, Y');

        return response()->json([
            'status' => true,
            'data' => $blog,
        ]);
    }

    // store a blog
    public function store(Request $request) {

        $validator = Validator:: make($request->all(), [
            'title' => 'required | min:10',
            'author' => 'required | min:3',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors(),
            ]);
        }

        $blog = Blog::create($request->all());
        // $blog = new Blog();
        // $blog->title = $request->title;
        // $blog->author = $request->author;
        // $blog->description = strip_tags($request->description);
        // $blog->shortDescription = $request->shortDescription;
        // $blog->save();

        // Save Image
        $tempImage = TempImage::find($request->image_Id);

        if ($tempImage != null) {
            $imageExtArray = explode('.',$tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time().'-'.$blog->id.'.'.$ext;

            $blog->image = $imageName;
            $blog->save();

            $sourcePath = public_path('uploads/temp/'.$tempImage->name);
            $destPath = public_path('uploads/blogs/'.$imageName);
            File::copy($sourcePath,$destPath);
        }

        return response()->json([
            'status' => true,
            'message' => 'Blog added successfully.',
            'data' => $blog,
        ]);
    }

    // update a blog
    public function update($id, Request $request) {
        $blog = Blog::find($id);

        //$this->authorize('update', $blog);

        if($blog == null){
        return response()->json([
            'status' => false,
            'message' => 'Blog not found.',
        ]);
        }

        $validator = Validator:: make($request->all(), [
            'title' => 'required | min:10',
            'author' => 'required | min:3',
            'description' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please fix the errors',
                'errors' => $validator->errors(),
            ]);
        }

        $blog->title = $request->title;
        $blog->author = $request->author;
        $blog->description = strip_tags($request->description);
        $blog->shortDescription = $request->shortDescription;
        $blog->save();

        $tempImage = TempImage::find($request->image_Id);

        if ($tempImage != null) {
            $imageExtArray = explode('.',$tempImage->name);
            $ext = last($imageExtArray);
            $imageName = time().'-'.$blog->id.'.'.$ext;

            $blog->image = $imageName;
            $blog->save();

            $sourcePath = public_path('uploads/temp/'.$tempImage->name);
            $destPath = public_path('uploads/blogs/'.$imageName);
            File::copy($sourcePath,$destPath);
        }
        
        return response()->json([
            'status' => true,
            'message' => 'Blog updated successfully.',
            'data' => $blog,
        ]);

    }

    // delete a blog
    public function destroy($id) {

        $blog=Blog::find($id);

        //$this->authorize('delete', $blog); 

        if($blog == null){
            return response()->json([
                'status' => false,
                'message' => 'Blog not found.',
            ]);
        }

        //delete img
        File::delete(public_path('uploads/blogs/'.$blog->image));

        //delete img in DB
        $blog->delete();

        return response()->json([
            'status' => true,
            'message' => 'Blog deleted successfully.',
        ]);


    }
}
