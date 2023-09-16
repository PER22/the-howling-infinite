const express = require('express');
const router = express.Router();
const essayController = require('../../controllers/api/essays');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadImage } = require('../../utilities/aws');

router.get('/sideEssays', essayController.getAllSideEssays);
router.get('/mainEssay', essayController.getMainEssay);
router.get('/image-url/:essayId', essayController.getSignedURLForEssayCoverImage)
router.get('/:essayId', essayController.getEssayById);
router.put('/:essayId', ensureLoggedIn, essayController.updateEssayById);
router.delete('/:essayId', ensureLoggedIn, essayController.deleteEssayById);
router.post('/', ensureLoggedIn, uploadImage.single('coverPhoto'), essayController.createEssay);


module.exports = router;