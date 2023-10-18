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

//Anonymous
// GET /api/blog/:postId - Get specific blog post
router.get('/:postId', blogController.getBlogPostById);

//Admin only
// POST /api/blog - Create new blog post
router.post('/', ensureLoggedIn, adminOnly,  blogController.preCreateBlogPost, uploadFiles.single("coverPhoto"), blogController.postCreateBlogPost);

//Admin only
// PUT /api/blog/:postId - Update a specific blog post
router.put('/:postId',  ensureLoggedIn, adminOnly, blogController.preUpdateBlogPost, uploadFiles.single("coverPhoto"), blogController.postUpdateBlogPost);

//Admin only
// DELETE /api/blog/:postId - Delete a specific blog post
router.delete('/:postId',  ensureLoggedIn, adminOnly, blogController.deleteBlogPostById);

//All signed-in users
// POST /api/blog/star/:postId - Star a specific post
router.post('/star/:postId', ensureLoggedIn, blogController.starBlogPostById);

//All signed-in users
// DELETE /api/blog/star/:postId - Unstar a specific post
router.delete('/star/:postId', ensureLoggedIn, blogController.unstarBlogPostById);

module.exports = router;