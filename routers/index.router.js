const express = require('express');

const router = express.Router();
const userRouter = require('./user.router');
const uploadRouter = require('./upload.router');

router.use("/users", userRouter);
router.use("/upload", uploadRouter);


module.exports = router;