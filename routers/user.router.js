const express = require('express');
const userRouter = express.Router();
const {registerUser, loginUser, findUser, getUser, getUserPermission, checkAuthenticated, logOut} = require('../controllers/userController');
const authenticateToken = require('../middlewares/auth.middleware')

userRouter.post('/register',registerUser)
userRouter.post('/login',loginUser)
userRouter.get('/check_auth',checkAuthenticated)
userRouter.get('/logout',logOut);
userRouter.get('/:id',authenticateToken,findUser)
userRouter.get('/permission/:id',getUserPermission)
userRouter.get('/',authenticateToken,getUser)


module.exports = userRouter;