const express = require('express');
const router = express.Router();
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const contactController = require('../../controllers/api/contact');

//Signed-in users
// POST route to create a new comment
router.post('/', ensureLoggedIn, contactController.sendMessage);

module.exports = router;