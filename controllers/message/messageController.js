const { getReceiverSocketId, io } = require("../../middleware/socket");
const Message = require("../../models/messageSchema");
const User = require("../../models/userSchema");

const messageController = () => {
    return {
        getUserForSide: async (req, res) => {
            try {
                const userId = req.user._id
                const filterdUser = await User.find({ _id: { $ne: userId } }).select("-password")
                // Bolew is for if you list user also but for now we are listing without loggedin user
                // const filterdUser = await User.find().select("-password");

                // if (!filterdUser) {
                //     return res.status(404).json({ message: "No user found." });
                // }
                // const AddYouFunc = (user) => {
                //     return user + " (You)"
                // }
                // const finalizedUser = filterdUser?.map((user) => {
                //     if (user._id.toString() === userId.toString()) {
                //         return {
                //             ...user._doc,
                //             username: AddYouFunc(user.username)
                //         }
                //     }
                //     return user
                // })
                res.status(200).json({ messages: "Side-User Retrieved Successfully.", count: filterdUser.length, users: filterdUser });

            } catch (error) {
                console.log(error);
                res.status(500).json({ message: "Server error." })

            }
        },
        getAllMessages: async (req, res) => {
            const userChatId = req.params.id
            const myId = req.user.id
            try {
                const messages = await Message.find({
                    $or: [
                        { senderId: myId, receiverId: userChatId },
                        { senderId: userChatId, receiverId: myId },
                    ]
                })
                res.status(200).json({ message: "Message Retrived Successfully.", messagesList: messages });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        },
        sendMessage: async (req, res) => {
            const { text } = req.body;

            const image = req.file ? `/uploads/chatImages/${req.file.filename}` : null;
            const senderId = req.user._id;
            const receiverId = req.params.id;

            try {
                const newMessage = await Message({
                    senderId,
                    receiverId,
                    text,
                    image,
                });
                await newMessage.save();

                const receiverSocketId = await getReceiverSocketId(receiverId)
                if (receiverSocketId) {
                    io.to(receiverSocketId).emit('newMessage', newMessage);
                    console.log(`Message sent to socket ${receiverSocketId}`);
                } else {
                    console.log(`Receiver ${receiverId} is not online.`);
                }

                res.status(201).json({
                    message: "Message sent successfully.",
                    message: newMessage
                });
            } catch (error) {
                console.log(error);
                res.status(500).json({ message: 'Server error' });
            }
        }
    }
}
module.exports = messageController;