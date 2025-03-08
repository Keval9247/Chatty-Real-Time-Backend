const multer = require('multer')
const fs = require('fs');
const path = require('path');


const deleteOldProfilePicture = (user) => {
    const uploadsDirectory = path.join(__dirname, '..', 'uploads', 'updatedImages');
    fs.readdir(uploadsDirectory, (err, files) => {
        if (err) {
            console.error("Error reading directory", err);
            return;
        }
        // Delete the previous image if it exists
        files.forEach((file) => {
            if (file.includes(user.username)) {
                const filePath = path.join(uploadsDirectory, file);
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file ${filePath}`, err);
                    } else {
                        console.log(`Deleted old profile picture: ${filePath}`);
                    }
                });
            }
        });
    });
};


const profileupdatestorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/updatedImages')
    },
    filename: function (req, file, cb) {
        deleteOldProfilePicture(req.user);
        cb(null, Date.now() + `-${req.user.username}-` + file.originalname)
    }
})

const uploadImage = multer({
    storage: profileupdatestorage,
    limits: { fileSize: 1024 * 1024 * 5 },
})


const chatImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/chatImages')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-Chat-' + file.originalname)
    }
})

const uploadImageInChat = multer({
    storage: chatImageStorage,
    limits: { fileSize: 1024 * 1024 * 5 },
})


module.exports = {
    uploadImage,
    uploadImageInChat
}