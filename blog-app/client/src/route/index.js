import React from 'react'
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from '../pages/Home'
import Blogs from '../pages/Blogs'
import NavBar from '../layout/NavBar'
import CreateBlog from '../pages/CreateBlog'
import Register from '../pages/Register';
import Login from '../pages/Login';
import Activate from '../pages/Activate';
import Profile from '../pages/Profile';

const Index = () => {
  return (
    <BrowserRouter>
    <ToastContainer />
    <NavBar />
        <Routes>
            <Route path= "/" element={<Home/>} />
            <Route path= "/blogs" element={<Blogs />} />
            <Route path="/create-blog" element={<CreateBlog/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/profile" element={<Profile/>}/>
            <Route path="/api/users/activate/:token" element={<Activate/>}/>


        </Routes>
    </BrowserRouter>
  )
}

export default Index