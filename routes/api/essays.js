const express = require('express');
const router = express.Router();
const essayController = require('../../controllers/api/essays');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.get('/sideEssays', essayController.getAllSideEssays);
router.get('/mainEssay', essayController.getMainEssay);
router.get('/:essayId', essayController.getEssayById);
router.post('',ensureLoggedIn, essayController.createEssay);
router.put('/:essayId', ensureLoggedIn, essayController.updateEssayById);
router.delete('/:essayId', ensureLoggedIn, essayController.deleteEssayById);


module.exports = router;