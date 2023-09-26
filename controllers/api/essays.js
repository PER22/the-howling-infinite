const Essay = require('../../models/essay');
const { uploadToS3, downloadFromS3, deleteFromS3, generateSignedURL, updateInS3 } = require('../../utilities/aws');
const downsize = require("downsize");

// New sanitization function
const sanitizeTitleForS3 = (title) => {
    return title.replace(/[^a-zA-Z0-9-_]/g, '-')
                .replace(/\s+/g, '-')
                .toLowerCase();
};

async function createEssay(req, res) {
    try {
        const { title, bodyText, isMain } = req.body;
        
        // Use the sanitization function to generate the s3key
        const s3key = `essays/${sanitizeTitleForS3(title)}.txt`;
        const fileURL = await uploadToS3(s3key, bodyText);
        
        let coverPhotoS3Key = null;
        
        // Check if image was uploaded
        if (req.file && req.file.key) {
            coverPhotoS3Key = req.file.key;
        }

        // Save the essay along with cover photo info (if uploaded)
        const essay = await Essay.create({
            title,
            author: req.user._id,
            essayS3Key: fileURL,
            coverPhotoS3Key,
            isMain
        });

        res.status(201).json({ essay, fileURL });
    } catch (error) {
        console.error('Error creating essay:', error);
        res.status(400).json({ error: 'Failed to create essay' });
    }
}

async function getEssayById(req, res) {
    try {
        const essay = await Essay.findById(req.params.essayId).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        const essayBody = await new Promise(async (resolve, reject) => {
            const incomingMsg = await downloadFromS3(essay.essayS3Key);
            let data = '';
            incomingMsg.on('data', chunk => data += chunk);
            incomingMsg.on('end', () => resolve(data));
            incomingMsg.on('error', err => reject(err));
        });
        res.status(200).json({ ...essay.toObject(), bodyText: essayBody.toString() });
    } catch (error) {
        console.error('Error fetching essay:', error);
        res.status(400).json({ error: 'Failed to fetch essay' });
    }
}

async function getAllSideEssayPreviews(req, res) {
    try {
        const essays = await Essay.find({isMain: false}).populate('author');
        if (!essays || essays.length === 0) {
            return res.status(404).json({ error: 'Essays not found.' });
        }

        const essayWholeBodies = await Promise.all(essays.map(essay => {
            return new Promise(async (resolve, reject) => {
                const incomingMsg = await downloadFromS3(essay.essayS3Key);

                let data = '';
                incomingMsg.on('data', chunk => data += chunk);
                incomingMsg.on('end', () => resolve(data));
                incomingMsg.on('error', err => reject(err));
            });
        }));
        const combinedEssays = essays.map((essay, index) => {
            return {
                ...essay.toObject(),
                bodyText:  downsize(essayWholeBodies[index] , {words: 20, append: "..."})
            };
        });
        res.status(200).json(combinedEssays);
    } catch (error) {
        console.error('Error fetching essays:', error);
        res.status(400).json({ error: 'Failed to fetch essays' });
    }
}

async function getMainEssay(req, res) {
    try {
        const essay = await Essay.findOne({ isMain: true }).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        const essayBody = await new Promise(async (resolve, reject) => {
            const incomingMsg = await downloadFromS3(essay.essayS3Key);
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

async function getMainEssayPreview(req, res) {
    try {
        const essay = await Essay.findOne({isMain: true}).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Main essay not found.' });
        }

        // Download the essay body from S3
        const essayWholeBody = await new Promise(async (resolve, reject) => {
            const incomingMsg = await downloadFromS3(essay.essayS3Key);

            let data = '';
            incomingMsg.on('data', chunk => data += chunk);
            incomingMsg.on('end', () => resolve(data));
            incomingMsg.on('error', err => reject(err));
        });

        // Truncate the essay body
        const truncatedBody = downsize(essayWholeBody, {words: 20, append: "..."});

        res.status(200).json({ ...essay.toObject(), bodyText: truncatedBody });

    } catch (error) {
        console.error('Error fetching main essay:', error);
        res.status(400).json({ error: 'Failed to fetch main essay' });
    }
}

async function updateEssayById(req, res) {
    try {
        const { title, bodyText } = req.body;
        const essay = await Essay.findById(req.params.essayId);
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        if(req.user._id !== essay.author.toString()){
            return res.status(403).json({ error: "You don't have permission to edit this essay."});
        }
        if (title) {
            essay.title = title;
        }
        if (bodyText) {
            await updateInS3(essay.essayFileKey, bodyText);
        }

        essay.lastEdited = Date.now();
        await essay.save();

        res.status(200).json(essay);
    } catch (error) {
        console.error('Error updating essay:', error);
        res.status(400).json({ error: 'Failed to update essay' });
    }
}

async function updateMainEssay(req, res){
    try {
        const { title, bodyText } = req.body;
        const essay = await Essay.findOne({isMain: true});
        if (!essay) {
            return res.status(404).json({ error: 'Main essay not found.' });
        }
        if(req.user._id !== essay.author.toString()){
            return res.status(403).json({ error: "You don't have permission to edit the main essay."});
        }

        let oldS3Key;
        if (req.file && req.file.key) {
            // Store old S3 key
            oldS3Key = essay.coverPhotoS3Key;
            // Set new S3 key
            essay.coverPhotoS3Key = req.file.key;
        }

        if (title) {
            essay.title = title;
        }
        if (bodyText) {
            await updateInS3(essay.essayS3Key, bodyText);
        }

        essay.lastEdited = Date.now();
        await essay.save(); // Save all changes once

        // Delete old image from S3 (after saving to DB for consistency)
        if (oldS3Key) {
            await deleteFromS3(oldS3Key);
        }

        res.status(200).json(essay);
    } catch (error) {
        console.error("Failed to update essay:", error); // For debugging
        res.status(400).json({ error: 'Failed to update essay' });
    }
}


async function deleteEssayById(req, res) {
    try {
        const essay = await Essay.findById(req.params.essayId);
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        if(req.user._id !== essay.author.toString()){
            return res.status(403).json({ error: "You don't have permission to edit this essay."});
        }
        await deleteFromS3(essay.essayFileKey);
        await essay.remove();

        res.status(200).json({ message: 'Essay deleted successfully' });
    } catch (error) {
        console.error('Error deleting essay:', error);
        res.status(400).json({ error: 'Failed to delete essay' });
    }
}

async function getSignedURLForEssayCoverImage(req, res){
    if (req.params?.essayId === 'undefined' || !req.params.essayId) {
        return res.status(400).json({ error: 'Invalid essay ID.' });
    }
    try {
            const essay = await Essay.findById(req.params.essayId);
            if (!essay) {
                return res.status(404).json({ error: 'Essay not found.' });
            }
            const coverPhotoS3Key = essay.coverPhotoS3Key;
            if (!coverPhotoS3Key) {
                return res.status(204).json({message: 'No cover photo associated with this essay.'});
            }
            const signedURL = await generateSignedURL(coverPhotoS3Key);
            res.status(200).json({ signedURL });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            res.status(400).json({ error: 'Failed to generate signed URL' });
        }
}

module.exports = {
    createEssay,
    getAllSideEssayPreviews,
    getMainEssay,
    getEssayById,
    updateEssayById,
    updateMainEssay,
    deleteEssayById,
    getSignedURLForEssayCoverImage,
    getMainEssayPreview
};
