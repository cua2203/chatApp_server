const express = require('express');
const uploadRouter = express.Router();
const authenticateToken = require('../middlewares/auth.middleware')
const {upload,uploadSingle} = require('../controllers/uploadController.js');



uploadRouter.post('/single',upload.single('image'),uploadSingle);


module.exports = uploadRouter;