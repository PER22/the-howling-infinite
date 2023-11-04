//controllers/blog.js:
const BlogModel = require('../../models/blog');
const { uploadToS3, downloadFromS3, deleteFromS3, updateInS3 } = require('../../utilities/aws');
const downsize = require("downsize");

// New sanitization function
const sanitizeTitleForS3 = (title) => {
    return title.replace(/[^a-zA-Z0-9-_]/g, '-')
                .replace(/\s+/g, '-')
                .toLowerCase();
};

async function preCreateBlogPost(req, res, next){
    
    try {
        // Create the essay without actual content just to get _id back
        const newPost = await BlogModel.create({
            title: "temporary",
            author: req.user._id,
            htmlS3Key: "not a real key",
            preview: "temporary preview"
        });
        // Attach the newEssay to the req object
        req.entity = newPost;
        next();
    } catch (error) {
        console.error('Error during preCreateBlogPost middleware:', error);
        res.status(400).json({ error: 'Failed during preCreateBlogPost middleware.' });
    }
}

//Admin only
async function postCreateBlogPost(req, res) {
    try {
        const { title, bodyText } = req.body;
        // Use the sanitization function to generate the s3key
        const s3key = `blog/${sanitizeTitleForS3(title)}.txt`;
        const htmlS3Key = await uploadToS3(s3key, bodyText);
        let coverPhotoS3Key = null;
        
        if (req.file) {
            coverPhotoS3Key = req.file.key;
        }

        const newPost = req.entity;
        // Save the blog post along with cover photo info (if uploaded)
        newPost.title = title;
        newPost.htmlS3Key = htmlS3Key;    
        newPost.coverPhotoS3Key = coverPhotoS3Key;
        newPost.preview = downsize(req.body.bodyText , {words: 20});
        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        req.entity.removeOne();
        console.error('Error creating blog post:', error);
        res.status(400).json({ error: 'Failed to create blog post' });
    }
}
 
//Anonymous
async function getBlogPostById(req, res) {
    try {
        const content = await BlogModel.findById(req.params.postId).populate('author');
        if (!content) {
            return res.status(404).json({ error: 'Blog post not found.' });
        }
        const contentBody =  await downloadFromS3(content.htmlS3Key);
        res.status(200).json({ ...content.toObject(), bodyText: contentBody.toString() });
    } catch (error) {
        console.log('Error fetching content:', error);
        res.status(400).json({ error: 'Failed to fetch content' });
    }
}

//Anonymous
async function getAllBlogPostPreviews(req, res) {
    try {
        const posts = await BlogModel.find().populate('author');
        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: 'Posts not found.' });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching post previews:', error);
        res.status(400).json({ error: 'Failed to fetch post previews' });
    }
}

async function preUpdateBlogPost(req, res, next){
    try {
        const blogPost = await BlogModel.findById(req.params.postId);
        if(!blogPost){return res.status(400).json({ error: "Failed to find blog post." });}
        //delete cover image
        if(blogPost.coverPhotoS3Key){
            await deleteFromS3(blogPost.coverPhotoS3Key);
        }
        blogPost.coverPhotoS3Key = null;
        //delete html
        req.entity = blogPost;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: "preUpdateBlogPostfailed." });
    }
}

//Admin only
async function postUpdateBlogPost(req, res) {
    try {
        const { title, bodyText} = req.body; //User can only affect title and body text
        const blogPost = req.entity;
        if (!blogPost) {
            return res.status(404).json({ error: 'Blog post not found.' });
        }
        if(req.user._id !== blogPost.author.toString()){
            return res.status(403).json({ error: "You don't have permission to edit this blog post."});
        }
        if (title) {
            blogPost.title = title;
        }
        if (req.file) {
            blogPost.coverPhotoS3Key = req.file.key;
        }        
        if (bodyText) {
            await updateInS3(blogPost.htmlS3Key, bodyText);
            blogPost.preview = downsize(bodyText , {words: 20});
        }
        await blogPost.save();
        res.status(200).json(blogPost);
    } catch (error) {
        console.error('Error updating blog post:', error);
        res.status(400).json({ error: 'Failed to update blog post.' });
    }
}

//Admin only
async function deleteBlogPostById(req, res) {
    try {
        const blogPost = await BlogModel.findById(req.params.postId);
        if (!blogPost) {
            return res.status(404).json({ error: 'Post not found.' });
        }
        if(req.user._id.toString() !== blogPost.author.toString()){
            return res.status(403).json({ error: "You don't have permission to delete this content."});
        }
        if(blogPost.coverPhotoS3Key){await deleteFromS3(blogPost.coverPhotoS3Key);}
        await blogPost.deleteOne();
        res.status(200).json({ message: 'Blog post deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(400).json({ error: 'Failed to delete content.' });
    }
}

//All logged in users
async function starBlogPostById(req, res) {
    try {
      const postId = req.params.postId;
      const userId = req.user._id;
      const foundPost = await BlogModel.findById(postId);
      if(!foundPost){
        return res.status(404).json({eror: "Post not found."});
      }
      // Add the user's reference to the post's stars array
      await BlogModel.findByIdAndUpdate(
        postId,
        { $addToSet: { stars: userId }},
        { new: true }
      );
      let post = await BlogModel.findById(postId);
      const numStars = post.stars.length;
      post = await BlogModel.findByIdAndUpdate(
        postId,
        { $set: { numStars } },
        { new: true }
      );
      res.status(200).json(post);
    } catch (error) {
      console.error('Error starring post:', error);
      res.status(500).json({ error: 'Failed to star post' });
    }
}

//All logged in users
async function unstarBlogPostById(req, res) {
    try {
      const postId = req.params.postId;
      const userId = req.user._id;
  
      const foundPost = await BlogModel.findById(postId);
      if(!foundPost){
        return res.status(404).json({eror: "Post not found."});
      }
      let post = await BlogModel.findByIdAndUpdate(
        postId,
        { $pull: { stars: userId } },
        { new: true }
      );
      post = await BlogModel.findById(postId);
      const numStars = post.stars.length;
      post = await BlogModel.findByIdAndUpdate(
        postId,
        { $set: { numStars } },
        { new: true }
      );
      res.status(200).json(post);
    } catch (error) {
      console.error('Error unstarring post:', error);
      res.status(500).json({ error: 'Failed to unstar post' });
    }
} 


module.exports = {
//Create
    preCreateBlogPost,
    postCreateBlogPost,
//Read
    getBlogPostById,
//Previews
    getAllBlogPostPreviews, 
//Update
    preUpdateBlogPost,
    postUpdateBlogPost,
    starBlogPostById,
    unstarBlogPostById,
//Delete
    deleteBlogPostById,
};
