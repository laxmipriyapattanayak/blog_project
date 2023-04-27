import React from 'react'
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import {BrowserRouter, Route, Routes} from "react-router-dom"
import Home from '../pages/Home'
import Blogs from '../pages/Blogs'
import NavBar from '../layout/NavBar'
import CreateBlog from '../pages/CreateBlog'

const Index = () => {
  return (
    <BrowserRouter>
    <ToastContainer />
    <NavBar />
        <Routes>
            <Route path= "/" element={<Home/>} />
            <Route path= "/blogs" element={<Blogs />} />
            <Route path="/create-blog" element={<CreateBlog/>}/>
        </Routes>
    </BrowserRouter>
  )
}

export default Index