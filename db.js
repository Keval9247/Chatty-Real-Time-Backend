const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('MongoDB Connecting...');
        await mongoose.connect(process.env.MONGO_URL);
        console.log('MongoDB Connected.');

    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;
