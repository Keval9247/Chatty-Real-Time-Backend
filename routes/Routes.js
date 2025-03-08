const express = require('express');
const Route = express.Router();
const authRoute = require('./AuthRoutes/authRoute.route');
const messageRoute = require('./messages/messageRoute.route');


Route.use('/auth', authRoute);
Route.use('/messages', messageRoute);

module.exports = Route;