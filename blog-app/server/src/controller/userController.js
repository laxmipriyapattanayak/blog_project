const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const createError = require('http-errors');
const mongoose = require('mongoose');
const User = require('../models/userModel');
const dev = require('../config');
const { successHandler } = require('./requestHandler');
const { sendEmailWithNodeMailer } = require('../helper/sendEmail');

const registerUser = async(req,res,next) => {
    try{
        const { name, email, password, phone }= req.body;

        if(!name || !email || !password || !phone)
            throw createError(404,'name, email, password or phone is missing');
        
        if(password.length < 6)
            throw createError(400,'length of password should be atleast 6 characters');
        
        const image = req.file;
        if (image && image.size > Math.pow(1024, 2))
            throw createError(
                400,
                'file too large.file size must be less than 1 mb'
            );

        const user = await User.findOne({ email });
        if (user)
        throw createError(
            400,
            'user with this email already exist.please sign in'
        );

        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //create a token for storing data temporarily
           const token = jwt.sign({ ...req.body, password: hashedPassword, image: image.path },
            String(dev.app.jwtActivationSecretKey), {expiresIn: '10m'})

        //prepare emaildata using jwt token
        const emailData={
            email,
            subject: "Acount Activation Email",
            html: `
            <h2> Hello ${name}! </h2>
            <p> please click here to <a href="${dev.app.clientUrl}/api/users/activate/${token}" target="_blank">activate your account </a></p>
            `,
        };
        sendEmailWithNodeMailer(emailData);

        return successHandler(res, 200, 'email sent,please go to your email', {token})

        //res.status(200).json({ message: 'email was sent' });
    } catch (error) {
        if (error.name === 'validationError') {
            next(createError(422, error.message));
            return;
        }
        next(error)
    }
};
//verify email
const verifyUserEmail = async (req, res, next) => {
    try{
        //get token from req body
        const token  = req.body.token;
        if( !token )
            throw createError(404,'token not found');
        //verify token and decode data
        const decoded=jwt.verify(token, String(dev.app.jwtActivationSecretKey));

        const existingUser = await User.findOne({ email: decoded.email });
        if(existingUser)
            return res.status(400).send({
                success: false,
                error: 'this account is already activated',
            });

        //create user
           const newUser = new User({ ...decoded });
        
        //save the user
        const user= await newUser.save();

        //send the response
        if(!user) throw createError(400,'user was not created');

        return successHandler(
            res,
            201,
            'user was created successfully ! please sign in'
        ); 
        
    } catch (error){
        next(error);
    }
};
//login user
const loginUser = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        if( !email || !password) 
            throw createError(404, 'wrong email or password ')

        if(password.length < 6)
            throw createError(400, 'password must be atleast 6 characters')
        const user = await User.findOne({ email })

        if (!user) 
            throw createError(404, 'user doesnot exist with this email. please register first');

        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if(!isPasswordMatched)
            throw createError(400, 'email/password did not match');

        if(user.isBanned)
            throw createError(403, 'user is banned');

        const token = jwt.sign({ _id: user._id }, String(dev.app.jwtAuthorizationSecretKey),
                {expiresIn: '10m'}
        );

        if(req.cookies[`${user._id}`]){
            req.cookies[`${user._id}`] = " ";
        }

        res.cookie(String(user._id), token, {
            path: '/',
            expires: new Date(Date.now() + 1000 * 60 * 9 ),
            httpOnly: true, 
            //secure: true,
        }); 

        const userData= {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            image: user.image,
            isAdmin: user.isAdmin,
        };

        return successHandler(res, 200, 'user is signed in',{
            user: userData,
            token,
        });
    } catch (error) {
        next(error)
    }
    return successHandler(res, 200, 'user was loggedin', {
        user: userData,
        token: token,
    });   
};
// logout user
const logoutUser = async (req, res, next) => {
    try {
        if(!req.headers.cookie) {
            return res.status(404).send({
                message: 'no cookie found',
            });
        }
        const token = req.headers.cookie.split('=')[1];

        if (!token) {
            return res.status(404).send({
                message: 'no token found',
            })
        }
        const decoded = jwt.verify(token,String(dev.app.jwtAuthorizationSecretKey));
        if(!decoded)
            throw createError(403,'Invalid Token');
        
        if(req.cookies[`${decoded._id}`]){
            req.cookies[`${decoded._id}`] = '';
        }

        res.clearCookie(`${decoded._id}`);
        return successHandler(res, 200, 'user is loggedout');
    } catch (error) {
        next(error);
    }
};
const getUserProfile = async (req, res, next) => {
    try{
        const id = req.params.id;
        const user = await User.findById(id);
        if(!user) throw createError(404,'user was not found')
        return successHandler(res, 200, 'user returned successfully', {user : user})
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            next(createError(400, 'invalid id'));
            return;
        }
        next(error);
    }
};
const getRefreshToken = async (req,res,next) => {
        try {
            if(!req.headers.cookie) {
                return res.status(404).send({
                    message: 'no cookie found',
                });
            }
            const oldToken = req.headers.cookie.split('=')[1];
    
            if (!oldToken) {
                return res.status(404).send({
                    message: 'no token found',
                })
            }
            const decoded = jwt.verify(oldToken,String(dev.app.jwtAuthorizationSecretKey));
            if(!decoded) throw createError(403,'invalid token');

            const token = jwt.sign(
                {_id: decoded._id },
                String(dev.app.jwtAuthorizationSecretKey),
                { expiresIn: '15m' }
            );
            if(req.cookies[`${decoded._id}`]) {
                req.cookies[`${decoded._id}`] = '';
            }

            res.cookie(String(decoded._id),token, {
                path: '/',
                expires: new Date(Date.now() + 1000 * 60 * 2),
                httpOnly: true,
                sameSite: 'none',
                secure: true,
            });

            return successHandler(res, 200, 'user was signed in',{
                token,
            });

    } catch (error) {
        next(error)
    }
}

module.exports = { registerUser, verifyUserEmail, loginUser, getUserProfile, logoutUser, getRefreshToken }