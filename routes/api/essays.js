//routes/essays.js:
const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/api/content');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadImage } = require('../../utilities/aws');

// GET /api/essays/mainEssay
router.get('/mainEssay', contentController.getMainEssay);

// GET /api/essays/sideEssayPreviews
router.get('/sideEssayPreviews', contentController.getAllSideEssayPreviews);

// GET /api/essays/mainEssayPreview
router.get("/mainEssayPreview", contentController.getMainEssayPreview);

// PUT /api/essays/mainEssay
router.put('/mainEssay', ensureLoggedIn, uploadImage.single('coverPhoto'), contentController.updateMainEssay);
module.exports = router;