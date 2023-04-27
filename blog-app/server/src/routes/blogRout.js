const express = require('express');
const { getAllBlogs, createBlog, updateBlogs, deleteBlogs, getSingleBlog } = require('../controller/blogController');
const upload = require('../middleware/fileUpload');


const blogRouter = express.Router();

blogRouter.get('/', getAllBlogs);
blogRouter.post('/', upload.single('image'), createBlog);
blogRouter.put('/:id', updateBlogs);
blogRouter.delete('/:id', deleteBlogs);
blogRouter.get('/:id', getSingleBlog);

blogRouter.use("*", (req, res, next) => {
    res.send("route not found")
})

module.exports = blogRouter;