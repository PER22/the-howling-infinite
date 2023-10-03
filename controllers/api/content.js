//controllers/content.js:
const ContentModel = require('../../models/content');
const { uploadToS3, downloadFromS3, deleteFromS3, generateSignedURL, updateInS3 } = require('../../utilities/aws');
const downsize = require("downsize");

// New sanitization function
const sanitizeTitleForS3 = (title) => {
    return title.replace(/[^a-zA-Z0-9-_]/g, '-')
                .replace(/\s+/g, '-')
                .toLowerCase();
};

//Admin only
async function createContent(req, res) {
    try {
        const { title, bodyText, isMain, type } = req.body;
        // Use the sanitization function to generate the s3key
        const s3key = `${type}/${sanitizeTitleForS3(title)}.txt`;
        const contentS3Key = await uploadToS3(s3key, bodyText);
        
        let coverPhotoS3Key = null;
        // Check if image was uploaded
        if (req.file && req.file.key) {
            coverPhotoS3Key = req.file.key;
        }

        // Save the content along with cover photo info (if uploaded)
        const content = await ContentModel.create({
            title,
            author: req.user?._id,
            contentS3Key,
            coverPhotoS3Key,
            isMain,
            type,
            preview: downsize(bodyText , {words: 20, append: "..."})
        });

        res.status(201).json({ essay: content, contentS3Key });
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(400).json({ error: 'Failed to create content' });
    }
}
 //Anonymous
async function getMainEssay(req, res) {
    try {
        const essay = await ContentModel.findOne({ isMain: true, type: "essay" }).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        const essayBody = await new Promise(async (resolve, reject) => {
            const incomingMsg = await downloadFromS3(essay.contentS3Key);
            let data = '';
            incomingMsg.on('data', chunk => data += chunk);
            incomingMsg.on('end', () => resolve(data));
            incomingMsg.on('error', err => reject(err));
        });
        res.status(200).json({
            ...essay.toObject(),
            bodyText: essayBody
        });
    } catch (error) {
        console.error('Error fetching main essay:', error);
        res.status(400).json({ error: 'Failed to fetch main essay' });
    }
}

//Anonymous
async function getContentById(req, res) {
    try {
        const content = await ContentModel.findById(req.params.contentId).populate('author');
        if (!content) {
            return res.status(404).json({ error: 'Content not found.' });
        }
        const contentBody = await new Promise(async (resolve, reject) => {
            const incomingMsg = await downloadFromS3(content.contentS3Key);
            let data = '';
            incomingMsg.on('data', chunk => data += chunk);
            incomingMsg.on('end', () => resolve(data));
            incomingMsg.on('error', err => reject(err));
        });
        res.status(200).json({ ...content.toObject(), bodyText: contentBody.toString() });
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(400).json({ error: 'Failed to fetch content' });
    }
}

//Anonymous
async function getMainEssayPreview(req, res) {
    try {
        const essay = await ContentModel.findOne({isMain: true}).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Main essay not found.' });
        }
        return res.status(200).json(essay);
    } catch (error) {
        console.error('Error fetching main essay:', error);
        res.status(400).json({ error: 'Failed to fetch main essay' });
    }
}

//Anonymous
async function getAllSideEssayPreviews(req, res) {
    try {
        const essays = await ContentModel.find({isMain: false, type: 'essay'}).populate('author');
        if (!essays || essays.length === 0) {
            return res.status(404).json({ error: 'Essays not found.' });
        }
        const combinedEssays = essays.map((essay, index) => {
            return {
                ...essay.toObject(),
                bodyText:  essay.preview
            };
        });
        res.status(200).json(combinedEssays);
    } catch (error) {
        console.error('Error fetching essays:', error);
        res.status(400).json({ error: 'Failed to fetch essays' });
    }
}

//Anonymous
async function getAllBlogPostPreviews(req, res) {
    try {
        const posts = await ContentModel.find({type: 'blog'}).populate('author');
        if (!posts || posts.length === 0) {
            return res.status(404).json({ error: 'Posts not found.' });
        }
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error fetching post previews:', error);
        res.status(400).json({ error: 'Failed to fetch post previews' });
    }
}

//Admin only
async function updateMainEssay(req, res){
    try {
        const { title, bodyText } = req.body;
        const mainEssay = await ContentModel.findOne({isMain: true});
        if (!mainEssay) {
            return res.status(404).json({ error: 'Main essay not found.' });
        }
        if(req.user._id !== mainEssay.author.toString()){
            return res.status(403).json({ error: "You don't have permission to edit the main essay."});
        }

        let oldS3Key;
        if (req.file && req.file.key) {
            oldS3Key = mainEssay.coverPhotoS3Key;
            mainEssay.coverPhotoS3Key = req.file.key;
        }
        if (oldS3Key) {
            await deleteFromS3(oldS3Key);
        }

        if (title) {
            mainEssay.title = title;
        }
        if (bodyText) {
            await updateInS3(mainEssay.contentS3Key, bodyText);
        }
        await mainEssay.save(); // Save all changes once

        // Delete old image from S3 (after saving to DB for consistency)
        if (oldS3Key) {
            await deleteFromS3(oldS3Key);
        }

        res.status(200).json(mainEssay);
    } catch (error) {
        console.error("Failed to update essay:", error); // For debugging
        res.status(400).json({ error: 'Failed to update essay' });
    }
}

//Admin only
async function updateContentById(req, res) {
    try {
        const { title, bodyText} = req.body; //User can only affect title and body text
        const content = await ContentModel.findById(req.params.contentId);
        if (!content) {
            return res.status(404).json({ error: 'Content not found.' });
        }
        if(req.user._id !== content.author.toString()){
            return res.status(403).json({ error: "You don't have permission to edit this content."});
        }
        if (title) {
            content.title = title;
        }
        let oldS3Key;//Swap photos if a new one uploaded
        if (req.file && req.file.key) {
            // Store old S3 key
            oldS3Key = content.coverPhotoS3Key;
            // Set new S3 key
            content.coverPhotoS3Key = req.file.key;
        }
        if(oldS3Key){
            deleteFromS3(req.file.key);
        }
        if (bodyText) {
            await updateInS3(content.contentS3Key, bodyText);
            content.preview = downsize(bodyText , {words: 20, append: "..."});
        }
        await content.save();
        res.status(200).json(content);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(400).json({ error: 'Failed to update content' });
    }
}

//Admin only
async function deleteContentById(req, res) {
    try {
        const content = await ContentModel.findById(req.params.contentId);
        if (!content) {
            return res.status(404).json({ error: 'Cont not found.' });
        }
        if(req.user._id !== content.author.toString()){
            return res.status(403).json({ error: "You don't have permission to delete this content."});
        }
        await deleteFromS3(content.contentS3Key);
        if(content.coverPhotoS3Key){await deleteFromS3(content.coverPhotoS3Key);}
        await content.remove();
        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(400).json({ error: 'Failed to delete content.' });
    }
}

//All logged in users
async function starContentById(req, res) {
    try {
      const postId = req.params.postId;
      const userId = req.user._id;
      const foundPost = await ContentModel.findById(postId);
      if(!foundPost){
        return res.status(404).json({eror: "Post not found."});
      }
      // Add the user's reference to the post's stars array
      await ContentModel.findByIdAndUpdate(
        postId,
        { $addToSet: { stars: userId }},
        { new: true }
      );
      let post = await ContentModel.findById(postId);
      const numStars = post.stars.length;
      post = await ContentModel.findByIdAndUpdate(
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
async function unstarContentById(req, res) {
    try {
      const postId = req.params.postId;
      const userId = req.user._id;
  
      const foundPost = await ContentModel.findById(postId);
      if(!foundPost){
        return res.status(404).json({eror: "Post not found."});
      }
      let post = await ContentModel.findByIdAndUpdate(
        postId,
        { $pull: { stars: userId } },
        { new: true }
      );
      post = await ContentModel.findById(postId);
      const numStars = post.stars.length;
      post = await ContentModel.findByIdAndUpdate(
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

//Anonymous
async function getSignedURLForContentCoverImage(req, res){
    if (req.params?.contentId === 'undefined' || !req.params.contentId) {
        return res.status(400).json({ error: 'Invalid content ID.' });
    }
    try {
            const content = await ContentModel.findById(req.params.contentId);
            if (!content) {
                return res.status(404).json({ error: 'Content not found.' });
            }
            const coverPhotoS3Key = content.coverPhotoS3Key;
            if (!coverPhotoS3Key) {
                return res.status(204).json({message: 'No cover photo associated with this content.'});
            }
            const signedURL = await generateSignedURL(coverPhotoS3Key);
            res.status(200).json({ signedURL });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            res.status(400).json({ error: 'Failed to generate signed URL' });
        }
}

module.exports = {
//Create
    createContent,
//Read
    getMainEssay,
    getContentById,
//Previews
    getMainEssayPreview,
    getAllSideEssayPreviews,    
    getAllBlogPostPreviews, 
//Update
    updateMainEssay,
    updateContentById,
    starContentById,
    unstarContentById,
//Delete
    deleteContentById,
//Image proxy    
    getSignedURLForContentCoverImage
};
