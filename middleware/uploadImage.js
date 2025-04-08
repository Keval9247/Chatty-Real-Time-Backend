const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Delete old profile picture from the user's folder
const deleteOldProfilePicture = (user) => {
    const userDirectory = path.join(__dirname, '..', 'uploads', 'updatedImages', String(user.id));

    fs.readdir(userDirectory, (err, files) => {
        if (err) {
            console.error("Error reading user directory:", err);
            return;
        }

        files.forEach((file) => {
            if (file.includes(user.username)) {
                const filePath = path.join(userDirectory, file);
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
        const userId = req.user?._id?.toString() || "anonymous";
        const userDir = path.join(__dirname, '..', 'uploads', 'updatedImages', userId);

        // Ensure the directory exists
        fs.mkdir(userDir, { recursive: true }, (err) => {
            if (err) {
                console.error("Error creating user folder:", err);
                return cb(err);
            }

            cb(null, userDir);
        });
    },
    filename: function (req, file, cb) {
        deleteOldProfilePicture(req.user);
        const filename = Date.now() + `-${req.user.username}-` + file.originalname;
        cb(null, filename);
    }
});

const uploadImage = multer({
    storage: profileupdatestorage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

// No changes needed for chat image storage
const chatImageStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/chatImages');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-Chat-' + file.originalname);
    }
});

const uploadImageInChat = multer({
    storage: chatImageStorage,
    limits: { fileSize: 1024 * 1024 * 5 },
});

module.exports = {
    uploadImage,
    uploadImageInChat
};
