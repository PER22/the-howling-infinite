const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/api/comments');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const adminOnly = require('../../config/adminOnly');

//Signed-in users
// POST route to create a new comment
router.post('/', ensureLoggedIn, commentController.createComment);

//AdminOnly
router.put('/approve/:commentId', ensureLoggedIn, adminOnly, commentController.approveComment  )

//Anonymous
// GET route to comments associated with the entity ID
router.get('/on/:entityType/:entityId', commentController.getCommentsByEntity);

//Anonymous
// GET route to fetch a single comment by ID
router.get('/:commentId', commentController.getCommentById);

//Signed-in users
// PUT route to update a comment by ID
router.put('/:commentId', ensureLoggedIn, commentController.updateCommentById);

//Signed-in users
// DELETE route to delete a comment by ID
router.delete('/:commentId', ensureLoggedIn, adminOnly, commentController.deleteCommentById);

//AdminOnly
// GET route to fetch all unapproved comments
router.get('/unapproved', ensureLoggedIn, adminOnly, commentController.getAllUnapprovedComments);

module.exports = router;