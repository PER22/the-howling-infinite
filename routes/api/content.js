//routes/content.js:
const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/api/content');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadImage } = require('../../utilities/aws');

//   /api/content
router.post('/', ensureLoggedIn, uploadImage.single('coverPhoto'), contentController.createContent);
//api/content/uploadImage
router.post('/uploadImage', ensureLoggedIn, uploadImage.single("image"), (req, res) => {
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

//PUT api/content/:contentId
router.put('/:contentId', ensureLoggedIn, uploadImage.single('coverPhoto'), contentController.updateContentById);

//DELETE api/content/:contentId/star
router.delete('/:contentId/star', ensureLoggedIn, contentController.unstarContentById);

//DELETE api/content/:contentId
router.delete('/:contentId', ensureLoggedIn, contentController.deleteContentById);

//POST api/content/:contentId/star
router.post('/:contentId/star', ensureLoggedIn, contentController.starContentById);

module.exports = router;