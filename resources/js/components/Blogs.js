import React, {useEffect, useState} from 'react';
import BlogCard from './blogCard';

function Blogs() {
    const [blogs, setBlogs] = useState();
    const [keyword, setKeyword] = useState();
    const [searchBy, setSearchBy] = useState('title'); 


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
    }, 
    
    []);

    const searchBlogs = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch(`http://localhost:8000/api/blogs?keyword=${keyword}&searchBy=${searchBy}`);
            const result = await res.json();
            setBlogs(result.data);
        } catch (error) {
            console.error("Search failed:", error);
        }
    }
    
    
    return (
        <div className='container'>
            <div className='d-flex justify-content-center pt-5 mb-4'>

            <form onSubmit={(e) => searchBlogs(e)}>
                <div className='d-flex gap-2'>
                    <input
                        type="text"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        className='form-control'
                        placeholder='Search blogs'
                    />

                    <select
                        className='form-select'
                        value={searchBy}
                        onChange={(e) => setSearchBy(e.target.value)}
                        style={{ width: '150px' }}
                    >
                        <option value="title">Title</option>
                        <option value="author">Author</option>
                        <option value="date">Date</option>
                    </select>

                    <button className='btn btn-dark'>Search</button>
                </div>
            </form>

            </div>

            <div className='d-flex justify-content-between pt-5 mb-4'>
                <h4></h4>
                <a href="/create-blog" className='btn btn-dark'>Create</a>
            </div>
            <div className='row'>
                { (blogs) && blogs.map((blog) => {
                    return (<BlogCard blogs={blogs} setBlogs={setBlogs}key={blog.id} blog={blog} />)
                })}
            </div>
        </div>
    );
}

export default Blogs;
