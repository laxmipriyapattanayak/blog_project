import axios from "axios";
const baseURL = 'http://localhost:8080';

export const createBlogRequest = async ( newBlog ) => {

    const response = await axios.post(`${baseURL}/api/blogs`,newBlog);
    return response.data;
};

export const getAllBlogsRequest = async ( ) => {

    const response = await axios.get(`${baseURL}/api/blogs`);
    return response.data;
};