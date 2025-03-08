const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require("../../models/userSchema");
const { generateTokenFun } = require('../../middleware/utils/Tokens');

const authController = () => {
    return {
        signup: async (req, res) => {
            const { username, email, password } = req.body;

            if (!username || !email || !password) {
                return res.status(400).json({ message: 'Please provide all required fields: username, email, password' });
            }

            try {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    return res.status(400).json({ message: 'User already exists. Please try again with a different email or username.' });
                }

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                const newUser = new User({
                    username,
                    email,
                    password: hashedPassword,
                });

                const token = await generateTokenFun(newUser._id, res);

                if (!token) {
                    return res.status(500).json({ message: 'Failed to generate token' });
                }

                await newUser.save();

                res.status(200).json({
                    message: 'User registered successfully',
                    user: {
                        id: newUser._id,
                        username: newUser.username,
                        email: newUser.email,
                    },
                });

            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        },
        login: async (req, res) => {
            const { email, password } = req.body
            try {
                const user = await User.findOne({ email });
                if (!user) {
                    return res.status(400).json({ message: 'User not found' });
                }

                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) {
                    return res.status(400).json({ message: 'Invalid credentials' });
                }

                const token = await generateTokenFun(user._id, res);
                if (!token) {
                    return res.status(500).json({ message: 'Failed to generate token' });
                }

                res.status(200).json({
                    message: 'User logged in successfully',
                    token,
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        profilePic: user.profilePic,
                        createdAt: user.createdAt
                    },
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });

            }
        },
        logout: (req, res) => {
            try {
                res.clearCookie("Bearer");
                res.status(200).json({ message: 'User logged out successfully' });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        },
        updateProfilePic: async (req, res) => {
            const userId = req.user._id;
            const profilePic = req.file;
            if (!profilePic) {
                return res.status(400).json({ message: 'Profile picture is required.' });
            }

            try {
                const user = await User.findByIdAndUpdate(
                    userId,
                    { profilePic: profilePic.path },
                    { new: true }
                );
                if (!user) {
                    return res.status(404).json({ message: 'User not found' });
                }

                res.status(200).json({
                    message: 'Profile picture updated successfully',
                    user: {
                        id: user._id,
                        username: user.username,
                        email: user.email,
                        profilePic: user.profilePic,
                    }
                });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
            }
        },
        authCheck: async (req, res) => {
            try {
                if (req.user) {
                    res.status(200).json({
                        message: 'User authenticated successfully',
                        user: req.user
                    });
                }
                else {
                    res.status(401).json({ message: 'User not authenticated. Please Login again.' });
                }
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        }
    }
}

module.exports = authController;