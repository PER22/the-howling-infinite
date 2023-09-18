const express = require('express');
const router = express.Router();
const essayController = require('../../controllers/api/essays');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadImage } = require('../../utilities/aws');

router.get('/sideEssays', essayController.getAllSideEssayPreviews);
router.get("/mainEssayPreview", essayController.getMainEssayPreview);
router.get('/mainEssay', essayController.getMainEssay);
router.get('/image-url/:essayId', essayController.getSignedURLForEssayCoverImage);
router.get('/:essayId', essayController.getEssayById);
router.put('/:essayId', ensureLoggedIn, essayController.updateEssayById);
router.delete('/:essayId', ensureLoggedIn, essayController.deleteEssayById);
router.post('/uploadImage', ensureLoggedIn, uploadImage.single("image"), (req, res) => {
    console.log("api/essays/uploadImage endpoint hit");
    console.log("Full request: ", req);
    if (req.file) {
        console.log("File details:", req.file);
        res.json({
            imageUrl: req.file.location
        });
    } else {
        console.log("Image upload failed. No file detected in request.");
        res.status(400).json({ error: 'Image upload failed' });
    }
});
router.post('/', ensureLoggedIn, uploadImage.single('coverPhoto'), essayController.createEssay);


module.exports = router;