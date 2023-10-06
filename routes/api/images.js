const express = require('express');
const router = express.Router();
const imageController = require('../../controllers/api/images');


// GET /api/images/:imageTitle
router.get('/:imageTitle', imageController.fetchPublicImageURL);


module.exports = router;