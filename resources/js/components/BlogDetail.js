import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
//import { createRoot } from 'react-dom/client';

const BlogDetail = () => {
    const [blog, setBlog] = useState([]);
    const blogId = document.getElementById('blog-detail').getAttribute('data-id');

    const fetchBlog = async() => {
        const res = await fetch("http://localhost:8000/api/blogs/"+blogId);
        const result = await res.json();
        setBlog(result.data);
    }

    useEffect(() => {
        fetchBlog();
    },[]);

    return (
        <div className='container'>
            <div className='d-flex justify-content-between pt-5 mb-4'>
                <h2>{blog.title}</h2>
                <a href="/" className='btn btn-dark'>Back to blogs</a>
            </div>
            <div className='row'>
                <div className='col-md-12'>
                    <p>by <strong>{blog.author}</strong> on {blog.date}</p>
                    {
                        (blog.image) && <img className='w-100' src={`http://localhost:8000/uploads/blogs/${blog.image}`} />
                    }

                    <div className="mt-5" dangerouslySetInnerHTML={{__html: blog.description}}>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogDetail;

if (document.getElementById('blog-detail')) {
    // const container = document.getElementById('blog-detail');
    // const root = createRoot(container);
    // root.render(<BlogDetail />);
    ReactDOM.render(<BlogDetail />, document.getElementById('blog-detail'));
}