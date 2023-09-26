const express = require('express');
const router = express.Router();
const imageController = require('../../controllers/api/images');



router.get('/:imageTitle', imageController.fetchPublicImageURL);


module.exports = router;