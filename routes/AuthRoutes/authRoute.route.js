const express = require('express');
const { check, validationResult } = require('express-validator');
const authController = require('../../controllers/authController/AuthController');
const protectMiddlware = require('../../middleware/protectMiddlware');
const { uploadImage } = require('../../middleware/uploadImage');
const authRoute = express.Router();


authRoute.post('/signup', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('username', 'Username must be at least 3 characters long').isLength({ min: 3 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, authController().signup);

authRoute.post('/login', [
    check('email', 'Please enter a valid email').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
], (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, authController().login);

authRoute.post('/logout', authController().logout);

authRoute.put('/update-profile', protectMiddlware, uploadImage.single('profile'), authController().updateProfilePic);

authRoute.get('/check', protectMiddlware, authController().authCheck);

module.exports = authRoute;
