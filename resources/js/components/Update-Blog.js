import React, { useState, useEffect } from "react";
import ReactDOM from 'react-dom';
import { Button, Spinner } from "reactstrap";
import Editor from 'react-simple-wysiwyg';
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from 'react-toastify';

function UpdateBlog({ id }) {
    const [html, setHtml] = useState('');
    const [imageId, setImageId] = useState('');
    const [author, setAuthor] = useState('');
    const [currentImage, setCurrentImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [blogNotFound, setBlogNotFound] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [initialHtml, setInitialHtml] = useState('');

    function onChange(e) {
        setHtml(e.target.value);
        setValue('description', e.target.value); // Update form state
    }

    useEffect(() => {
        const fetchBlogData = async () => {
            try {
                setIsLoading(true);
                const res = await fetch(`http://localhost:8000/api/blogs/${id}`);
                
                if (!res.ok) {
                    throw new Error('Failed to fetch blog');
                }

                const result = await res.json();
                
                if (!result.status || !result.data) {
                    setBlogNotFound(true);
                    alert(result.message || 'Blog not found');
                    setTimeout(() => {
                        window.location.href = '/';
                    }, 2000);
                    return;
                }

                setHtml(result.data.description || '');
                setInitialHtml(result.data.description || '');
                setAuthor(result.data.author || '');
                setCurrentImage(result.data.image || '');
                setImageId(result.data.image_id || '');
                
                // Set form default values
                setValue('title', result.data.title);
                setValue('shortDescription', result.data.shortDescription);
                
            } catch (error) {
                setBlogNotFound(true);
                alert(error.message || 'Failed to load blog');
                setTimeout(() => {
                    window.location.href = '/';
                }, 2000);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBlogData();
    }, [id]);

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const res = await fetch("http://localhost:8000/api/save-temp-image", {
                method: "POST",
                body: formData
            });
            const result = await res.json();

            if (result.status === false) {
                alert(result.errors?.image || 'Failed to upload image');
                e.target.value = null;
                return;
            }

            setImageId(result.image.id);
            setCurrentImage('');
            alert('Image uploaded successfully!');
        } catch (error) {
            alert("Failed to upload image");
        }
    }

    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    useEffect(() => {
        register('title', { required: true, minLength: 10 });
        register('author', { required: true, minLength: 3 });
        register('description', { required: true });
        register('shortDescription');
        register('image_Id');
    }, [register]);

    const formSubmit = async (data) => {
        if (isSubmitting) return;
        setIsSubmitting(true);

        if ((!html || html.trim() === '') && (!initialHtml || initialHtml.trim() === '')) {
            alert('Description is required');
            setIsSubmitting(false);
            return;
        }

        try {
            const updatedData = { 
                ...data, 
                description: html, 
                image_Id: imageId,
                author: author,
                _method: 'PUT'
            };

            const res = await fetch(`http://localhost:8000/api/blogs/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData)
            });

            const result = await res.json();
            
            if (!res.ok || !result.status) {
                throw new Error(result.message || "Failed to update blog");
            }

            alert(result.message || "Blog updated successfully!");
            setTimeout(() => {
                window.location.href = `/blog-detail/${id}`;
            }, 1500);
        } catch (error) {
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    const showImage = () => {
        if (currentImage) {
            return `http://localhost:8000/uploads/blogs/${currentImage}`;
        }
        return null;
    }

    if (isLoading) {
        return (
            <div className="container py-5 text-center">
                <Spinner color="primary" />
                <p>Loading blog data...</p>
            </div>
        );
    }

    if (blogNotFound) {
        return (
            <div className="container py-5 text-center">
                <h4>Blog not found</h4>
                <p>Redirecting to homepage...</p>
            </div>
        );
    }

    return (
        <div className="container py-5">
            <div className="d-flex justify-content-between align-items-center pt-3 mb-4">
                <h2 className="fw-bold">Update Blog</h2>
                <a href='/' className="btn btn-outline-dark">Back</a>
            </div>
            <div className="card border-0 shadow-lg p-4">
                <form onSubmit={handleSubmit(formSubmit)}>
                    <div className="card-body">
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Title *</label>
                            <input 
                                {...register('title')}
                                type="text" 
                                className={`form-control form-control-lg ${errors.title && "is-invalid"}`}
                                placeholder="Title (min 10 characters)"
                                defaultValue={html.title}
                            />
                            {errors.title?.type === 'required' && (
                                <div className="invalid-feedback d-block">Title is required</div>
                            )}
                            {errors.title?.type === 'minLength' && (
                                <div className="invalid-feedback d-block">Title must be at least 10 characters</div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Short Description</label>
                            <input 
                                {...register('shortDescription')} 
                                type="text" 
                                className="form-control form-control-lg"  
                                placeholder="Short Description"
                                defaultValue={html.shortDescription}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Description *</label>
                            <Editor
                                containerProps={{style: {resize: 'vertical'}}} 
                                value={html} 
                                onChange={onChange} 
                                placeholder="Description"
                            />
                            {(!html || html.trim() === '') && (!initialHtml || initialHtml.trim() === '') && (
                                <div className="invalid-feedback d-block">Description is required</div>
                            )}
                            
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Image</label>
                            <input 
                                type="file" 
                                onChange={handleFileChange} 
                                className="form-control" 
                                accept="image/*"
                            />
                            <input type="hidden" {...register('image_Id')} value={imageId} />
                            {showImage() && (
                                <div className="mt-2">
                                    <p>Current Image:</p>
                                    <img 
                                        src={showImage()} 
                                        alt="Current blog" 
                                        style={{maxWidth: '200px', maxHeight: '200px'}} 
                                        className="img-thumbnail"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="mb-3">
                            <label className="form-label fw-semibold">Author *</label>
                            <input 
                                {...register('author')}
                                type="text" 
                                className={`form-control form-control-lg ${errors.author && "is-invalid"}`}
                                placeholder="Author (min 3 characters)"
                                value={author}
                                onChange={(e) => setAuthor(e.target.value)}
                            />
                            {errors.author?.type === 'required' && (
                                <div className="invalid-feedback d-block">Author is required</div>
                            )}
                            {errors.author?.type === 'minLength' && (
                                <div className="invalid-feedback d-block">Author must be at least 3 characters</div>
                            )}
                        </div>
                        <div>
                            <Button 
                                className="btn btn-dark" 
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Updating...' : 'Update'}
                            </Button>
                        </div>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
}

export default UpdateBlog;

if (document.getElementById('updateBlog')) {
    const element = document.getElementById('updateBlog');
    const id = element.getAttribute('data-id');
    ReactDOM.render(<UpdateBlog id={id} />, element);
}