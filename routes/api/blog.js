//routes/api/blog.js:
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const adminOnly = require('../../config/adminOnly');
const { uploadFiles } = require('../../utilities/aws');

const express = require('express');
const router = express.Router();
const blogController = require('../../controllers/api/blog');

//Anonymous
// GET /api/blog - Get all blog posts
router.get('/', blogController.getAllBlogPostPreviews);

router.get('/:postId', blogController.getBlogPostById);

//Admin only
// POST /api/blog - Create new blog post
router.post('/', ensureLoggedIn, adminOnly,  uploadFiles.single("coverPhoto"), blogController.createBlogPost);

//Admin only
// PUT /api/blog/:postId - Update a specific blog post
router.put('/:postId',  ensureLoggedIn, adminOnly, blogController.updateBlogPostById);

//Admin only
// DELETE /api/blog/:postId - Delete a specific blog post
router.delete('/:postId',  ensureLoggedIn, adminOnly, blogController.deleteBlogPostById);

//All signed-in users
// POST /api/blog/:postId/star - Star post
router.post('/:postId/star', ensureLoggedIn, blogController.starBlogPostById);

//All signed-in users
// DELETE /api/blog/:postId/star - Unstar post
router.delete('/:postId/star', ensureLoggedIn, blogController.unstarBlogPostById);

module.exports = router;