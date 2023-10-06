//routes/essays.js:
const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/api/essay');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadFiles } = require('../../utilities/aws');


// MAIN ESSAYS:
// GET /api/essays/mainEssayPreview
router.get("/mainEssayPreview", contentController.getMainEssayPreview);

// GET /api/essays/mainEssay
router.get('/mainEssay', contentController.getMainEssay);

// POST /api/essays
router.post('/', ensureLoggedIn, contentController.preCreateEssay, uploadFiles.fields([
    {name: 'coverPhoto', maxCount: 1},
    {name: 'html', maxCount: 1},
    {name: 'folderFiles'}
  ]), contentController.postCreateEssay);
  
// PUT /api/essays/mainEssay
router.put('/mainEssay', ensureLoggedIn, uploadFiles.fields([
  {name: 'coverPhoto', maxCount: 1},
  {name: 'html', maxCount: 1},
  {name: 'folderFiles'}
]), contentController.updateMainEssay);




// SIDE ESSAYS: 
// GET /api/essays/sideEssayPreviews
router.get('/sideEssayPreviews', contentController.getAllSideEssayPreviews);




module.exports = router;