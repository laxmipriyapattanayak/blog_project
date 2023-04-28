const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const dev = require('../config');
const User = require('../models/userModel');

const isLoggedIn = (req, res, next) => {
    try {
        if(!req.headers.cookie){
            return res.status(404).send({
                message: 'no cookie found',
            });
        }

        const token = req.headers.cookie.split('=')[1];

        if(!token){
            return res.status(404).send({
                message: 'no token found',
            });
        }
        
        const decoded = jwt.verify(
            token,
            String(dev.app.jwtAuthorizationSecretKey)
        );

        if(!decoded) throw createError(403, 'invalid token');

        req._id = decoded._id;
        next();

    } catch (error) {
        next(error);
    }
};

const isLoggedOut = (req,res,next) => {
    try {
        if (req.headers.cookie) {
            throw createError(
                401,
                'please login'
            );
        }
        next();
    } catch (error) {
        next(error);
    }
};

const isAdmin = async (req, res, next) => {
    try {
       const id = req._id;
       if(id) {
        const user = await User.findById(id);
        if(!user) 
            throw createError(404, 'no user found with this id');

        if(!user.isAdmin)
            throw createError(401, 'user is not an admin');
        next();
       } else{
            throw createError(400,'pleasel login');
       }
    } catch (error) {
        next(error);
    }
};

module.exports = { isLoggedIn, isLoggedOut, isAdmin };