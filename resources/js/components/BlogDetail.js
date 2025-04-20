import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';

function stripHtmlTags(htmlString) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = htmlString;
  return tempDiv.textContent || tempDiv.innerText || "";
}

const BlogDetail = () => {
  const [blog, setBlog] = useState({});
  const [user_Id, setUserId] = useState('');
  const [user, setUser] = useState('');
  const [formData, setFormData] = useState({ comment: '' });
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);

  const blogId = document.getElementById('blog-detail').getAttribute('data-id');

  const fetchSessionUser = async () => {
    try {
      const res = await fetch('http://localhost:8000/user-info');
      const data = await res.json();
      setUserId(data.id);
      setUser(data.name);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchBlog = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/blogs/${blogId}`);
      const result = await res.json();
      setBlog(result.data);
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
  };

  const fetchComments = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/blogs/${blogId}/comments`);
      const data = await res.json();
      if (data.status) {
        setComments(data.data);
      } else {
        setComments([]);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlog();
    fetchSessionUser();
    fetchComments();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("User not loaded yet. Please wait a moment and try again.");
      return;
    }

    if (formData.comment.trim().length < 5) {
      alert("Comment must be at least 5 characters.");
      return;
    }

    const commentData = {
      name: user,
      comment: stripHtmlTags(formData.comment),
    };

    try {
      const res = await fetch(`http://localhost:8000/api/blogs/${blogId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commentData)
      });

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.indexOf('application/json') !== -1) {
        const result = await res.json();
        console.log('Server Response:', result);

        setFormData({ comment: '' });
        fetchComments();
      } else {
        const text = await res.text();
        console.error('Expected JSON, but got:', text);
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };


  const deleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/blogs/${blogId}/comments/${commentId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const result = await res.json();
        if (result.status) {
          setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
          console.log("Comment deleted successfully.");
        } else {
          console.error('Failed to delete comment:', result.message);
        }
      } catch (error) {
        console.error('Error deleting comment:', error);
      }
    }
  };
  

  if (loading) return <p>Loading comments...</p>;

  return (
    <div className='container'>
      <div className='d-flex justify-content-between pt-5 mb-4'>
        <h2>{blog.title}</h2>
        <a href='/' className='btn btn-dark'>Back to blogs</a>
      </div>

      <div className='row'>
        <div className='col-md-12'>
          <p>by <strong>{blog.author}</strong> on {blog.date}</p>
          {
            blog.image ? (
              <img className='w-100' src={`http://localhost:8000/uploads/blogs/${blog.image}`} alt='Blog' />
            ) : (
              <img className='w-100' src='https://media.istockphoto.com/id/1138075339/vector/people-vector-illustration-flat-cartoon-character-landing-page-template.jpg?s=612x612&w=0&k=20&c=HkNt0X45z7SKMJrurRFK1fviETYwRyJaW1EjAnE6vrQ=' alt='Default' />
            )
          }
          <div className="mt-5" dangerouslySetInnerHTML={{ __html: blog.description }}></div>
        </div>
      </div>

      <div className='row mt-5'>
        <div className='col-md-8'>
          <h4>Leave a Comment</h4>
          <form onSubmit={handleSubmit}>
            <div className='form-group mt-3'>
              <textarea
                name='comment'
                value={formData.comment}
                onChange={handleChange}
                rows='2'
                className='form-control'
                placeholder={`Comment as ${user}`}
                required
              ></textarea>
            </div>
            <button type='submit' className='btn btn-success mt-3'>Submit Comment</button>
          </form>
        </div>
      </div>

      <div className='mt-5'>
        <h4>Comments:</h4>
        {comments.length > 0 ? (
          comments.map((comment, index) => (
            <div key={index} className='border p-3 mb-2 position-relative'>
              <p><strong>{comment.name}</strong></p>
              <p>{comment.comment}</p>
              <small className='text-muted'>{comment.date}</small>

              {comment.name === user && (
                <button 
                onClick={() => {
                  console.log("Deleting comment with ID:", comment.id); 
                  deleteComment(comment.id);
                }} 
                  className='btn btn-danger btn-sm position-absolute' 
                  style={{ bottom: '10px', right: '10px' }}>
                  Delete
                </button>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

if (document.getElementById('blog-detail')) {
  ReactDOM.render(<BlogDetail />, document.getElementById('blog-detail'));
}
