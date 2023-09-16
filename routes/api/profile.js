const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/api/profiles');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.get('/', profileController.allProfiles);
router.get('/:profileId', profileController.getProfileById);
router.put('/:profileId', ensureLoggedIn, profileController.updateProfile);
router.delete('/:profileId', ensureLoggedIn, profileController.deleteProfile);

module.exports = router;