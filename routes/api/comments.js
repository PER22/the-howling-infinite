const express = require('express');
const router = express.Router();
const commentController = require('../../controllers/api/comments');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

const ensureAdmin = require('../../config/ensureLoggedIn');

// POST route to create a new comment
router.post('/', ensureLoggedIn, commentController.createComment);

// GET route to fetch a single comment by ID
router.get('/:commentId', commentController.getCommentById);

// PUT route to update a comment by ID (approve a comment)
router.put('/:commentId', ensureAdmin, commentController.updateCommentById);

// DELETE route to delete a comment by ID
router.delete('/:commentId', ensureAdmin, commentController.deleteCommentById);

// GET route to fetch all comments for a specific parent
router.get('/parent/:parentId', commentController.getCommentsByParent);

// GET route to fetch all unapproved comments
router.get('/unapproved', ensureAdmin, commentController.getAllUnapprovedComments);

module.exports = router;