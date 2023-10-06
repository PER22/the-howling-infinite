//routes/api/blog.js:
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const { uploadFiles } = require('../../utilities/aws');

const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/api/blog');


// GET /api/blog - Get all blog posts
router.get('/', blogController.getAllBlogPostPreviews);

// POST /api/blog - Create new blog post
router.post('/', ensureLoggedIn,   uploadFiles.single("coverPhoto"), blogController.createBlogPost);

// PUT /api/blog/:postId - Update a specific blog post
router.put('/:postId',  ensureLoggedIn, blogController.updateBlogPostById);

// DELETE /api/blog/:postId - Delete a specific blog post
router.delete('/:postId',  ensureLoggedIn, blogController.deleteBlogPostById);

// POST /api/blog/:postId/star - Star post
router.post('/:postId/star', ensureLoggedIn, blogController.starBlogPostById);

// DELETE /api/blog/:postId/star - Unstar post
router.delete('/:postId/star', ensureLoggedIn, blogController.unstarBlogPostById);

module.exports = router;