//routes/essays.js:
const express = require('express');
const router = express.Router();
const essayController = require('../../controllers/api/essay');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const adminOnly = require('../../config/adminOnly');
const { uploadFiles } = require('../../utilities/aws');

//Anonymous
// MAIN ESSAYS:
// GET /api/essays
router.get("/mainEssayPreview", essayController.getMainEssayPreview);

//Anonymous
// GET /api/essays
router.get('/', essayController.getMainEssay);

//Admin only
// POST /api/essays
router.post('/', ensureLoggedIn, adminOnly, essayController.preCreateEssay, uploadFiles.fields([
    {name: 'coverPhoto', maxCount: 1},
    {name: 'html', maxCount: 1},
    {name: 'folderFiles'}
  ]), essayController.postCreateEssay);

//Admin only
// PUT /api/essays/mainEssay
router.put('/', ensureLoggedIn, adminOnly, essayController.preUpdateMainEsssay, uploadFiles.fields([
  {name: 'coverPhoto', maxCount: 1},
  {name: 'html', maxCount: 1},
  {name: 'folderFiles'}
]), essayController.postUpdateMainEssay);

//Anonymous
// SIDE ESSAYS: 
// GET /api/essays/sideEssayPreviews
router.get('/sideEssayPreviews', essayController.getAllSideEssayPreviews);

//Logged In Users
// POST /api/essays/star/:essayId
router.post('/star/:essayId', ensureLoggedIn, essayController.starEssayById);

//Logged In Users
// DELETE /api/essays/star/:essayId
router.delete('/star/:essayId', ensureLoggedIn, essayController.unstarEssayById);

module.exports = router;