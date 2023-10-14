const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const imageController = require('../../controllers/api/images');

//Anonymous 
// GET /api/images/:imageTitle
router.get('/:imageTitle', imageController.fetchPublicImageURL);
const { uploadFiles } = require('../../utilities/aws');

//Logged in users
// POST api/images/upload
router.post('/upload', ensureLoggedIn, uploadFiles.single("image"), (req, res) => {
    if (req.file) {
        res.json({
            imageUrl: req.file.location
        });
    } else {
        res.status(400).json({ error: 'Image upload failed' });
    }
});



module.exports = router;