<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Comments;
use App\Models\Blog;

class CommentController extends Controller
{
    public function store(Request $request, $blogs_id)
    {
        $this->validate($request, [
            'name' => 'required',
            'comment' => 'required|min:5|max:255'
        ]);
    
        $comment = new Comments();
        $comment->name = $request->name; 
        $comment->comment = $request->comment;
        $comment->blogs_id = $blogs_id;
    
        $comment->save();
    
        return response()->json([
            'message' => 'Comment added successfully',
            'comment' => $comment
        ], 201);
    }

    public function show($id)
    {
        try {
            $comments = Comments::where('blogs_id', $id)->get();

            if ($comments->isEmpty()) {
                return response()->json([
                    'status' => false,
                    'message' => 'No comments found.',
                ]);
            }

            $comments->transform(function ($comment) {
                $comment->date = \Carbon\Carbon::parse($comment->created_at)->format('d M, Y');
                return $comment;
            });

            return response()->json([
                'status' => true,
                'data' => $comments,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => false,
                'message' => 'Error: ' . $e->getMessage(),
            ], 500); 
        }
}

//delete comments
public function destroy($blogId, $commentId)
{
    $comment = Comments::find($commentId);
    
    if ($comment == null) {
        return response()->json([
            'status' => false,
            'message' => 'Comment not found.',
        ]);
    }

    $comment->delete();

    return response()->json([
        'status' => true,
        'message' => 'Comment deleted successfully',
    ]);
}


 
}
