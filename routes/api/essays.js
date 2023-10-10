//routes/essays.js:
const express = require('express');
const router = express.Router();
const essayController = require('../../controllers/api/essay');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const adminOnly = require('../../config/adminOnly');
const { uploadFiles } = require('../../utilities/aws');

//Anonymous
// MAIN ESSAYS:
// GET /api/essays/mainEssayPreview
router.get("/mainEssayPreviews", essayController.getMainEssayPreviews);

//Anonymous
// GET /api/essays/mainEssay
router.get('/mainEssay', essayController.getMainEssay);

//Admin only
// POST /api/essays
router.post('/', ensureLoggedIn, adminOnly, essayController.preCreateEssay, uploadFiles.fields([
    {name: 'coverPhoto', maxCount: 1},
    {name: 'html', maxCount: 1},
    {name: 'folderFiles'}
  ]), essayController.postCreateEssay);

//Admin only
// PUT /api/essays/mainEssay
router.put('/mainEssay', ensureLoggedIn, adminOnly, essayController.preUpdateMainEsssay, uploadFiles.fields([
  {name: 'coverPhoto', maxCount: 1},
  {name: 'html', maxCount: 1},
  {name: 'folderFiles'}
]), essayController.updateMainEssay);

//Anonymous
// SIDE ESSAYS: 
// GET /api/essays/sideEssayPreviews
router.get('/sideEssayPreviews', essayController.getAllSideEssayPreviews);

module.exports = router;