const userRouter = require("express").Router();

const { registerUser, verifyUserEmail, loginUser, getUserProfile, logoutUser, getRefreshToken } = require("../controller/userController");
const { isLoggedIn } = require("../middleware/auth");
const upload = require("../middleware/fileUpload");


userRouter.post("/register", upload.single('image'), registerUser);
userRouter.post('/activate', verifyUserEmail);
userRouter.get('/profile/:id', isLoggedIn, getUserProfile);
userRouter.post('/login', loginUser);
userRouter.post('/logout', isLoggedIn, logoutUser);
userRouter.get('/refresh-token', isLoggedIn, getRefreshToken);


userRouter.get('*' , (req, res) => {
    req.status(404).json({
        message: '404 not found',
    });
});

module.exports = userRouter;