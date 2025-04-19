import React from 'react';
import ReactDOM from 'react-dom';
import {toast} from 'react-toastify';

const BlogCard = ({blog, blogs, setBlogs}) => {

    const showImage = (img) => {
        return (img) ? 'http://localhost:8000/uploads/blogs/' + img : 'https://placehold.co/600x400';
    }

    const deleteBlog = (id) =>{
        if(confirm("Are you sure you want to delete this post?")){
            const res=fetch("http://localhost:8000/api/blogs/"+ id,{
                method:'DELETE'
            });

            const newBlogs = blogs.filter((blog)=>blog.id !=id)
            setBlogs(newBlogs);
            alert("The blog post has been deleted.");
        }
    }

    return (
        <div className='col-12 col-md-6 col-lg-3 mb-4 d-flex'>
            <div className='card border-0 shadow-lg h-100'>
                <img src={showImage(blog.image)} className='card-img-top' />
                <div className='card-body'>
                    <h2 className='h5'>{blog.title}</h2>
                    <p>{blog.shortDescription}</p>
                    <div className='d-flex justify-content-between'>
                        <a href={`/blog-detail/${blog.id}`} className='btn btn-dark'>Details</a>
                        
                        <div>
                        <a href={`#`} className='text-danger' onClick={()=>deleteBlog(blog.id)}>
                            <i className="bi bi-trash"></i>
                        </a>
                        <a href={`/blog/edit/${blog.id}`} className='text-dark ms-3'>
                            <i className="bi bi-pencil"></i>
                        </a>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default BlogCard;
