//routes/essays.js:
const express = require('express');
const router = express.Router();
const essayController = require('../../controllers/api/essay');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const adminOnly = require('../../config/adminOnly');
const { uploadFiles } = require('../../utilities/aws');
const essay = require('../../models/essay');

//Anonymous
// MAIN ESSAYS:
// GET /api/essays
router.get("/mainEssayPreview", essayController.getMainEssayPreview);

//Anonymous
// GET /api/essays
router.get('/', essayController.getMainEssay);
const afterUpload = (req, res, next) => {
  console.log("Got past the uploadFiles function.")
  next();
};
const logFiles = (req, res, next) => {
  console.log("Files uploaded: ", req.files);
  next();
};

//Admin only
// POST /api/essays
router.post('/', 
// ensureLoggedIn, 
// adminOnly, 
essayController.preCreateEssay, 
uploadFiles.fields([
    {name: 'coverPhoto', maxCount: 1},
    {name: 'html', maxCount: 1},
    {name: 'folderFiles'}
  ]), 
  // afterUpload, 
  // logFiles, 
  essayController.postCreateEssay);

//Admin only
// PUT /api/essays/mainEssay
router.put('/', ensureLoggedIn, adminOnly, essayController.preUpdateMainEssay, uploadFiles.fields([
  {name: 'coverPhoto', maxCount: 1},
  {name: 'html', maxCount: 1},
  {name: 'folderFiles'}
]), essayController.postUpdateMainEssay);

//Anonymous
// SIDE ESSAYS: 
// GET /api/essays/sideEssayPreviews
router.get('/sideEssayPreviews', essayController.getAllSideEssayPreviews);

router.get('/:essayId', essayController.getEssayById);

router.put('/:essayId', ensureLoggedIn, adminOnly, essayController.preUpdateSideEssay, uploadFiles.fields([
  {name: 'coverPhoto', maxCount: 1},
  {name: 'html', maxCount: 1},
  {name: 'folderFiles'}
]), essayController.postUpdateSideEssay);

router.delete('/:essayId', ensureLoggedIn, adminOnly, essayController.deleteEssayById);
//Logged In Users
// POST /api/essays/star/:essayId
router.post('/star/:essayId', ensureLoggedIn, essayController.starEssayById);

//Logged In Users
// DELETE /api/essays/star/:essayId
router.delete('/star/:essayId', ensureLoggedIn, essayController.unstarEssayById);

module.exports = router;