const express = require('express');
const route = express.Router();
const protectMiddlware = require('../../middleware/protectMiddlware');
const messageController = require('../../controllers/message/messageController');
const { uploadImageInChat } = require('../../middleware/uploadImage');

route.get('/side-user-list', protectMiddlware, messageController().getUserForSide);
route.get('/:id', protectMiddlware, messageController().getAllMessages);

route.post('/send/:id', uploadImageInChat.single('chatIamge'), protectMiddlware, messageController().sendMessage);



module.exports = route;