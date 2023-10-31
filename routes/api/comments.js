const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/api/comments');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const adminOnly = require('../../config/adminOnly');

//Signed-in users
// POST route to create a new comment
router.post('/', ensureLoggedIn, commentController.createComment);


//Anonymous
// GET route to comments associated with the entity ID
router.get('/', commentController.getComments);

//AdminOnly
// GET route to fetch all unapproved comments
router.get('/moderate', ensureLoggedIn, adminOnly, commentController.getAllUnapprovedComments);

//AdminOnly
// GET route to fetch all unapproved comments
router.post('/moderate/:commentId', ensureLoggedIn, adminOnly, commentController.approveCommentById);

//Anonymous
// GET route to fetch a single comment by ID
router.get('/:commentId', commentController.getCommentById);

//Signed-in users
// PUT route to update a comment by ID
router.put('/:commentId', ensureLoggedIn, commentController.updateCommentById);

//Comment's Authors and Admins only
// DELETE route to delete a comment by ID

router.delete('/:commentId', ensureLoggedIn, commentController.deleteCommentById);


module.exports = router;