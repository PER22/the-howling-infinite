const Essay = require('../../models/essay');
const { uploadToS3, downloadFromS3, deleteFromS3, generateSignedURL } = require('../../utilities/aws');

async function createEssay(req, res) {
    console.log("req.body", req.body);
    try {
        const { title, bodyText, isMain } = req.body;

        // Handle essay text upload
        const s3key = `essays/${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
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
        const essayBody = await downloadFromS3(essay.essayS3Key);
        res.status(200).json({ essay, bodyText: essayBody.toString() });
    } catch (error) {
        console.error('Error fetching essay:', error);
        res.status(400).json({ error: 'Failed to fetch essay' });
    }
}

async function getAllSideEssays(req, res) {
    try {
        const essays = await Essay.find({isMain: false}).populate('author');
        if (!essays || essays.length === 0) {
            return res.status(404).json({ error: 'Essays not found.' });
        }
        const essayBodies = await Promise.all(essays.map(essay => downloadFromS3(essay.essayS3Key)));
        const combinedEssays = essays.map((essay, index) => {
            return {
                ...essay.toObject(),
                bodyText: essayBodies[index].toString()
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
        const essay = await Essay.findOne({isMain : true}).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        const essayBody = await downloadFromS3(essay.essayS3Key);
        res.status(200).json({ ...essay.toObject(), bodyText: essayBody.toString() });
    } catch (error) {
        console.error('Error fetching essay:', error);
        res.status(400).json({ error: 'Failed to fetch essay' });
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
                console.log("No Photo associated with essay");
                return res.status(204).json({message: 'No cover photo associated with this essay.'});
            }
            // Generate a signed URL using the coverPhotoS3Key
            const signedURL = await generateSignedURL(coverPhotoS3Key);
            res.status(200).json({ signedURL });
        } catch (error) {
            console.error('Error generating signed URL:', error);
            res.status(400).json({ error: 'Failed to generate signed URL' });
        }
}


module.exports = {
    createEssay,
    getAllSideEssays,
    getMainEssay,
    getEssayById,
    updateEssayById,
    deleteEssayById,
    getSignedURLForEssayCoverImage,
};
