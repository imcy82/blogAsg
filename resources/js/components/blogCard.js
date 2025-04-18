import React from 'react';
import ReactDOM from 'react-dom';

const BlogCard = ({blog}) => {

    const showImage = (img) => {
        return (img) ? 'http://localhost:8000/uploads/blogs/' + img : 'https://placehold.co/600x400';
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
                        <a href='#' className='text-dark'>
                            <i className="bi bi-pencil"></i>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BlogCard;
