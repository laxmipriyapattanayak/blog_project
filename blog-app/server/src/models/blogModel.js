const {Schema, model} = require("mongoose");

const blogSchema = new Schema({
    title: {
        required: true,
        type: String,
        trim: true,
        unique: true,
        minlength: 3
    },
    description: {
        required: true,
        type: String,
        trim: true,
    },
    image: {
        required: true,
        type: String,
        trim: true,
    },
    slug: {
        required: true,
        type: String,
    },
},
    { timestamps: true }
);

const Blog = model('Blog', blogSchema);

module.exports = Blog;