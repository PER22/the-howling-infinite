const express = require('express');
const router = express.Router();
const postController = require('../../controllers/api/blog');
const ensureLoggedIn = require('../../config/ensureLoggedIn');


// GET /api/blog - Get all blog posts
router.get('/', postController.allPosts);

// GET /api/blog/:postId - Get a specific blog post
router.get('/:postId',  postController.getPostById);

// POST /api/blog - Create a new blog post
router.post('/',  ensureLoggedIn, postController.createPost);

// PUT /api/blog/:postId - Update a specific blog post
router.put('/:postId',  ensureLoggedIn, postController.updatePost);

// DELETE /api/blog/:postId - Delete a specific blog post
router.delete('/:postId',  ensureLoggedIn, postController.removePost);

// POST /api/blog/:postId/star - Star post
router.post('/:postId/star', ensureLoggedIn, postController.starPost);

// DELETE /api/blog/:postId/star - Unstar post
router.delete('/:postId/star', ensureLoggedIn, postController.unstarPost);

module.exports = router;