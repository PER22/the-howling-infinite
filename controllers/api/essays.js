const Essay = require('../../models/essay');
const { uploadToS3, downloadFromS3, updateInS3, deleteFromS3 } = require('../../utilities/aws');

async function createEssay(req, res) {
    try {
        const { title, bodyText } = req.body;
        const s3key = `essays/${Date.now()}-${title.replace(/\s+/g, '-').toLowerCase()}.txt`;
        const fileURL = await uploadToS3(s3key, bodyText);
        const essay = await Essay.create({ title, author: req.user._id, s3key });
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
        const essayBody = await downloadFromS3(essay.s3key);
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
        const essayBodies = await Promise.all(essays.map(essay => downloadFromS3(essay.s3key)));
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
        const essayBody = await downloadFromS3(essay.s3key);
        res.status(200).json({ essay, bodyText: essayBody.toString() });
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
            await updateInS3(essay.s3key, bodyText);
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
        await deleteFromS3(essay.s3key);
        await essay.remove();

        res.status(200).json({ message: 'Essay deleted successfully' });
    } catch (error) {
        console.error('Error deleting essay:', error);
        res.status(400).json({ error: 'Failed to delete essay' });
    }
}

module.exports = {
    createEssay,
    getAllSideEssays,
    getMainEssay,
    getEssayById,
    updateEssayById,
    deleteEssayById
};