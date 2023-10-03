const express = require('express');
const router = express.Router();
const contentController = require('../../controllers/api/content');

// GET /api/blog - Get all blog posts
router.get('/', contentController.getAllBlogPostPreviews);

module.exports = router;