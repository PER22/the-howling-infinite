//routes/content.js:
const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/api/essay');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadFiles } = require('../../utilities/aws');

// function logRequestDetails(req, res, next) {
//     console.log("Request Body:", req.body);
//     console.log("Request Files:", req.files);
//     next();  
// }



// POST /api/content
router.post('/', ensureLoggedIn,   uploadFiles.fields([{name: 'coverPhoto', maxCount: 1}, {name: 'pdf', maxCount: 1}]), contentController.createContent);

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

// GET api/content/:contentId
router.get('/:contentId', contentController.getContentById);

// GET api/content/image-url/contentId
router.get('/image-url/:contentId', contentController.getSignedURLForContentCoverImage);

// PUT api/content/:contentId
router.put('/:contentId', ensureLoggedIn, uploadFiles.fields([{name: 'coverPhoto', maxCount: 1}, {name: 'pdf', maxCount: 1}]), contentController.updateContentById);

//DELETE api/content/:contentId/star
router.delete('/:contentId/star', ensureLoggedIn, contentController.unstarContentById);

//DELETE api/content/:contentId
router.delete('/:contentId', ensureLoggedIn, contentController.deleteContentById);

//POST api/content/:contentId/star
router.post('/:contentId/star', ensureLoggedIn, contentController.starContentById);

module.exports = router;