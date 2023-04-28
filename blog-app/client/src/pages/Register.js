import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { registerUser } from '../services/UserService';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [image,setImage] = useState('');

    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };
    const handlePhoneChange = (event) => {
        setPhone(event.target.value);
    };
    const handleImageChange = (event) => {
        setImage(event.target.files[0]);
    };

    const handleSubmit = async(event) => {
        event.preventDefault();
        try{
            const newUser = new FormData();
            newUser.append('name',name);
            newUser.append('email', email);
            newUser.append('password', password);
            newUser.append('phone', phone);
            newUser.append('image', image);
            
            const response = await registerUser(newUser);
            toast.success(response.message);

        } catch (error) {
            toast.error(error.response.data.error.message);
        }
    };
    return (
        <div>
            <h1>RegisterUser</h1>
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
                    <label htmlFor="name">Name</label>
                    <input type="text" value={name} onChange={handleNameChange} required />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" value={email} onChange={handleEmailChange} required />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" value={password} onChange={handlePasswordChange} required />
                </div>
                <div>
                    <label htmlFor="phone">Phone</label>
                    <input type="number" value={phone} onChange={handlePhoneChange} required />
                </div>
                <div>
                    <input type='file' name='image' onChange={handleImageChange} 
                    accept='image/*' required />
                </div>
    
                <button type='submit'>RegisterUser</button>
            </form>
        </div>
    )
}

export default Register;