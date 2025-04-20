import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Button, Input, Label } from "reactstrap";
import Editor from 'react-simple-wysiwyg';
//import { createRoot } from 'react-dom/client';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

function CreateBlog() {
    const [html, setHtml] = useState('');
    const [imageId, setImageId] = useState('');
    const [user_Id, setUserId] = useState('');
    const [author, setAuthor] = useState('');

    function onChange(e) {
        setHtml(e.target.value);
    }

    useEffect(() => {
        const fetchSessionUser = async () => {
            const res = await fetch('http://localhost:8000/user-info');
            const data = await res.json();
            setUserId(data.id);
            setAuthor(data.name);
        };
    
        fetchSessionUser();
    }, []);
    
    

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append("image", file);

        const res = await fetch("http://localhost:8000/api/save-temp-image", {
            method: "POST",
            body: formData
        });

        const result = await res.json();

        if (result.status == false) {
            alert(result.errors.image);
            e.target.value = null;
        }

        setImageId(result.image.id);
    }

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
      } = useForm();

    function stripHtmlTags(htmlString) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = htmlString;
        return tempDiv.textContent || tempDiv.innerText || "";
    }
    const formSubmit = async (data) => {
        const newData = { ...data, "description": html, image_Id: imageId, "author":author, "user_id": user_Id}

        const res = await fetch("http://localhost:8000/api/blog", {
            method: "POST",
            headers: {
                'Content-type' : "application/json",
            },
            body: JSON.stringify(newData)
        });

        const result  = await res.json();
        console.log(result);
        // if (!result) {
        //     toast.error("Failed to create blog");
        // }
        //toast.success("Blog added successfully.");
        window.location.href = "/";

    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center pt-3 mb-4">
                <h2 className="fw-bold">Create Blog</h2>
                <a href='/' className="btn btn-outline-dark">Back</a>
            </div>
            <div className="card border-0 shadow-lg p-4">
                <form onSubmit={handleSubmit(formSubmit)}>
                <div className="card-body">
                <div className="mb-3">
                    <label className="form-label fw-semibold">Title</label>
                    <input 
                    {...register('title', {required:true,minLength: {value: 10,message: 'Title must be at least 10 characters'}})}
                    type="text" 
                    className={`form-control form-control-lg ${errors.title && "is-invalid"}`}
                    placeholder="Title"
                    />
                    {errors.title && <div className="invalid-feedback d-block">{errors.title.message}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Short Description</label>
                    <input 
                    {...register('shortDescription')} 
                    type="text" 
                    className="form-control form-control-lg"  
                    placeholder="Short Description"
                    />
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Description</label>
                    <Editor
                    containerProps={{style: {resize: 'vertical'}}} 
                    value={html} 
                    onChange={onChange} 
                    placeholder="Description"
                    />
                    {/* <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {html}
                    </ReactMarkdown> */}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Image</label>
                    <input type="file" onChange={handleFileChange} className="form-control" />
                    {/* {image && <img src={image} alt="Preview" style={{maxWidth: '200px', marginTop: '10px'}} />} */}
                </div>
                <div className="mb-3">
                    <label className="form-label fw-semibold">Author</label>
                    <input 
                    {...register('author')}
                    type="text" 
                    className={`form-control form-control-lg ${errors.author && "is-invalid"}`}
                    placeholder="Author" //refelect this part the logged in user info
                    value={author}
                    readOnly
                    />
                    {errors.author && <div className="invalid-feedback d-block">Author field is required</div>}
                </div>
                <div>
                    <Button className="btn btn-dark">Create</Button>
                </div>
                </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default CreateBlog;


if (document.getElementById('createBlog')) {
    // const container = document.getElementById('createBlog');
    // const root = createRoot(container);
    // root.render(<CreateBlog />);
    ReactDOM.render(<CreateBlog />, document.getElementById('createBlog'));
}
