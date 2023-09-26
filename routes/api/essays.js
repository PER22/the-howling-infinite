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
router.put('/mainEssay', ensureLoggedIn, uploadImage.single('coverPhoto'), essayController.updateMainEssay);
router.put('/:essayId', ensureLoggedIn, uploadImage.single('coverPhoto'), essayController.updateEssayById);
router.delete('/:essayId', ensureLoggedIn, essayController.deleteEssayById);
router.post('/uploadImage', ensureLoggedIn, uploadImage.single("image"), (req, res) => {
    if (req.file) {
        res.json({
            imageUrl: req.file.location
        });
    } else {
        res.status(400).json({ error: 'Image upload failed' });
    }
});
router.post('/', ensureLoggedIn, uploadImage.single('coverPhoto'), essayController.createEssay);


module.exports = router;