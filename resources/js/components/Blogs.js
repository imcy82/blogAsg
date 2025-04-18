import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import BlogCard from './blogCard';

function Blogs() {
    const [blogs, setBlogs] = useState();
    useEffect(() => {
        let isMounted = true; // Add this flag
    
        const fetchBlogs = async () => {
            try {
                const res = await fetch('http://localhost:8000/api/blogs');
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(`Error ${res.status}: ${errorText}`);
                }
                const result = await res.json();
                if (isMounted) { // Only update state if still mounted
                    setBlogs(result.data);
                }
            } catch (error) {
                if (isMounted) {
                    console.error("Failed to fetch blogs:", error);
                }
            }
        };

        // const fetchPermissions = async () => {
        //     try {
        //         const res = await fetch('/api/permissions', {
        //             method: 'GET',
        //             credentials: 'include' // important for sanctum
        //         });
        //         const result = await res.json();
        //         console.log(result);
        //         setCanCreateBlog(result.canCreateBlog);
        //         setCanViewAnyBlog(result.canViewAnyBlog);
        //     } catch (err) {
        //         console.error("Error checking permissions", err);
        //     }
        // };
    
        fetchBlogs();
    
        return () => {
            isMounted = false; // Cleanup on unmount
        };
    }, []);
    
    
    return (
        <div className='container'>
            <div className='d-flex justify-content-between pt-5 mb-4'>
                <h4></h4>
                <a href="/create-blog" className='btn btn-dark'>Create</a>
            </div>
            <div className='row'>
                { (blogs) && blogs.map((blog) => {
                    return (<BlogCard key={blog.id} blog={blog} />)
                })}
            </div>
        </div>
    );
}

export default Blogs;
