import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { createBlogRequest } from '../services/BlogService';

const CreateBlog = () => {
    const [title,setTitle] = useState('');
    const [description,setDescription] = useState('');
    const [image,setImage] = useState('');

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
    };
    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
    };
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            const newBlog = new FormData();
            newBlog.append('title',title);
            newBlog.append('description',description);
            newBlog.append('image',image);

            const response = await createBlogRequest(newBlog);
            console.log(response);
            toast(response.message);

            setTitle('');
            setDescription('');
            setImage('');
            
        } catch (error) {
            console.log(error.response.data.error.message);
            toast(error.response.data.error.message);
        }
    };
    return (
        <div>
            <h1>create blogs</h1>
            {image && (
                <div>
                    <img 
                        src = {URL.createObjectURL(image)}
                        alt = "user"
                    />
                </div>
            )}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">title</label>
                    <input type="text" value={title} onChange={handleTitleChange} required />
                </div>
                <div>
                    <input type='file' name='image' onChange={handleImageChange} 
                    accept='image/*' required />
                </div>
                <div>
                    <label htmlFor="title">description</label>
                    <textarea name="description" id="description" value={description}
                    onChange={handleDescriptionChange} required>

                    </textarea>
                </div>
                <button type='submit'>create post</button>
            </form>
        </div>
    )
}

export default CreateBlog;