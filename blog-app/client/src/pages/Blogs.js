import React, { useEffect, useState } from 'react'
import { getAllBlogsRequest } from '../services/BlogService'
import Blog from './Blog'


const Blogs = () => {
  const [blogs, setBlogs] = useState([])

  const fetchAllBlogs = async () => {
    const response = await getAllBlogsRequest();
    setBlogs(response.data);
  }

  useEffect(() => {
    fetchAllBlogs();
  },[])
  return (
    <div>
      <h1>All Blogs</h1>
      {blogs.length > 0 && 
      blogs.map((blog) => <Blog key = {blog._id} blog={blog} />)}
    </div>
  );
};

export default Blogs