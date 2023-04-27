const Blog = require("../models/blogModel");
const { successHandler, errorHandler } = require("./requestHandler");
const createError = require("http-errors");
const slugify = require('slugify');

const getAllBlogs = async (req, res, next) => {
    try {
        const blogs = await Blog.find( {} );
        return successHandler(res, 200, 'returned all blogs', blogs)
    } catch (error) {
        next(error);
    }
};

const createBlog = async (req, res, next) => {
        try{
            const { title, description }= req.body;
    
            if( !title || !description )
                throw createError(404,'title or description is missing');
            
            if(title.length < 5)
                throw createError(400,'length of title should be atleast 5 characters');
            
            const image = req.file.path;
            if (image && image.size > 1024 * 1024 * 2)
                throw createError(
                    400,
                    'file too large.file size must be less than 1 mb'
                );
    
            const blog = await Blog.findOne({ title });
            if (blog)
            throw createError(
                400,
                'blog with this title already exist'
            );

            const newBlog = new Blog({
                title: title,
                slug: slugify(title),
                description: description,
                image: image,
            });

            const blogData = await newBlog.save();

            if(!blogData)
                return errorHandler(res, 400, 'Blog was not created');

            return successHandler(res, 200, 'blog created successfully', blogData);
    
    } catch (error) {
        next(error);
    }
};

const deleteBlogs = async (req, res, next) => {
    try {
        return successHandler(res, 200, 'blog deleted successfully', [])
    } catch (error) {
        next(error);
    }
};

const updateBlogs = async (req, res, next) => {
    try {
        return successHandler(res, 200, 'blog updated successfully', [])
    } catch (error) {
        next(error);
    }
};

const getSingleBlog = async (req, res, next) => {
    try {
        return successHandler(res, 200, 'return single blog', [])
    } catch (error) {
        next(error);
    }
};

module.exports = { getAllBlogs, deleteBlogs, updateBlogs, createBlog, getSingleBlog } ;