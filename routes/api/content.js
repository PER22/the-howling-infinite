//routes/content.js:
const express = require('express');
const router = express.Router();

const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadFiles } = require('../../utilities/aws');

// function logRequestDetails(req, res, next) {
//     console.log("Request Body:", req.body);
//     console.log("Request Files:", req.files);
//     next();  
// }



//api/content/uploadImage
router.post('/uploadImage', ensureLoggedIn, uploadFiles.single("image"), (req, res) => {
    if (req.file) {
        res.json({
            imageUrl: req.file.location
        });
    } else {
        res.status(400).json({ error: 'Image upload failed' });
    }
});


module.exports = router;