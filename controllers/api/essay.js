//controllers/essay.js:
const EssayModel = require('../../models/essay');
const InterludeModel = require('../../models/interlude');
const ChapterModel = require('../../models/chapter');

const { downloadFromS3, deleteFromS3, updateInS3 } = require('../../utilities/aws');

async function formatDate(now) {
    let month = now.getMonth() + 1;
    let day = now.getDate();
    let year = now.getFullYear().toString().substr(-2);

    let hours = now.getHours();
    let minutes = now.getMinutes();

    month = month < 10 ? '0' + month : month;
    day = day < 10 ? '0' + day : day;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${month}-${day}-${year}--${hours}:${minutes}`;
}

//Admin only
async function getDate(req, res, next) {
    try {
        req.folderName = await formatDate(new Date());
        // Move to the next middleware (which should be multer)
        next();
    } catch (error) {
        console.error('Error during getDate middleware:', error);
        res.status(400).json({ error: 'Failed during getDate middleware.' });
    }
}

async function createEssay(req, res) {
    try {
        let coverPhotoS3Key = null;
        if (req.files.coverPhoto && req.files.coverPhoto[0]) {
            coverPhotoS3Key = req.files.coverPhoto[0].key;
        }
        const sectionsData = JSON.parse(req.body.sections);
        const sections = [];

        for (const [index, sectionData] of sectionsData.entries()) {
            let section;
            if (sectionData.type === 'Interlude') {
                section = await InterludeModel.create({ ...sectionData, index });
            } else if (sectionData.type === 'Chapter') {
                // Retrieve the corresponding file for this chapter
                const pdfFile = req.files['pdfs'] ? req.files['pdfs'][index] : "oooof"; //TODO
                const pdfS3Key = pdfFile ? pdfFile.key : null;

                // Create chapter with text data and pdfS3Key
                section = await ChapterModel.create({
                    ...sectionData,
                    pdfS3Key: pdfS3Key || "uploadFailed?",  //TODO 
                    index
                });
            } else {
                throw new Error(`Invalid section type: ${sectionData.type}`);
            }
            sections.push(section._id);
        }

        // Create Essay with sections and cover photo
        const newEssay = await EssayModel.create({
            author: req.user?._id,
            title: req.body.title,
            isMain: req.body.isMain === 'true',
            sections: sections,
            coverPhotoS3Key
        });

        res.status(201).json(newEssay);
    } catch (error) {
        console.error('Error creating essay:', error);
        res.status(400).json({ error: 'Failed to create essay', details: error.message });
    }
}


//Anonymous
async function getMainEssay(req, res) {
    try {
        const essay = await EssayModel.findOne({ isMain: true }).populate('author').populate('sections');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        console.log("Essay being returned by backend:", essay, "\n\n");
        return res.status(200).json(essay);
    } catch (error) {
        console.error('Error fetching main essay:', error);
        res.status(400).json({ error: 'Failed to fetch main essay' });
    }
}

//Anonymous
async function getEssayById(req, res) {
    try {
        const essay = await EssayModel.findById(req.params.essayId).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        const contentBody = await downloadFromS3(essay.htmlS3Key);
        const essayObj = essay.toObject();
        essayObj.bodyHTML = contentBody;
        res.status(200).json(essayObj);
    } catch (error) {
        console.error('Error fetching side essay:', error);
        res.status(400).json({ error: 'Failed to fetch side essay.' });
    }
}

//Anonymous

async function getMainEssayPreview(req, res) {
    try {
        const essay = await EssayModel.findOne({ isMain: true }).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Main essay preview not found.' });
        }
        return res.status(200).json(essay);
    } catch (error) {
        console.error('Error fetching main essay preview:', error);
        res.status(400).json({ error: 'Failed to fetch main essay preview' });
    }
}

//Anonymous
//TODO: needs reworking for new essay structure
async function getAllSideEssayPreviews(req, res) {
    try {
        const essays = await EssayModel.find({ isMain: false }).populate('author');
        if (!essays || essays.length === 0) {
            return res.status(404).json({ error: 'Essays not found.' });
        }
        const combinedEssays = essays.map((essay, index) => {
            return {
                ...essay.toObject(),
                bodyText: essay.preview
            };
        });
        res.status(200).json(combinedEssays);
    } catch (error) {
        console.error('Error fetching essays:', error);
        res.status(400).json({ error: 'Failed to fetch essays' });
    }
}



//Admin only
async function updateMainEssay(req, res) {
    try {
        const mainEssay = await EssayModel.findOne({ isMain: true }).populate('sections');
        if (!mainEssay) { res.status(400).json({ error: "Failed to find main essay." }); }
        // Update the main essay's title if provided
        mainEssay.title = req.body.title || mainEssay.title;
        // Update the main essay's cover photo if provided
        if (req.files.coverPhoto && req.files.coverPhoto[0]) {
            mainEssay.coverPhotoS3Key = req.files.coverPhoto[0].key;
        }
        //Update Sections: Delete sections that were removed from the form
        let formSections = JSON.parse(req.body.sections)
        console.log("formSections:", formSections);
        //for each section that exists in the database currently:
        //see if it is in the form's list of sections. 
        
        const existingSectionIds = mainEssay.sections.map(section => section._id.toString());
        const sectionsToRemove = existingSectionIds.filter(id => !formSections.some(fs => fs._id === id));
        for (const sectionId of sectionsToRemove) {
            const sectionToRemove = mainEssay.sections.id(sectionId);
            if (sectionToRemove.type === "Chapter") {
                await deleteFromS3(sectionToRemove.pdfS3Key);
                await ChapterModel.findByIdAndDelete(sectionToRemove._id);
            } else {
                await InterludeModel.findByIdAndDelete(sectionToRemove._id);
            }
            mainEssay.sections.pull(sectionId); // Remove the section from the mainEssay
        }

        //any deleted sections are now gone.

        //update already extant sections:
            // Update existing sections
            for (const formSection of formSections) {
                const existingSection = mainEssay.sections.find(sec => sec._id.toString() === formSection._id);
                if (existingSection) {
                    existingSection.title = formSection.title;
                    existingSection.number = formSection.number;
                    existingSection.index = formSection.index;
                    //Here we need to check req.files to see if there is a submitted pdf associated with this existing essay
                    await existingSection.save();
                }
            }
            

        //now, lets worry about any added sections:

            mainEssay.sections.sort((sectionA, sectionB) => sectionA.index - sectionB.index);
        const savedEssay = await mainEssay.save();
        return res.status(200).json(savedEssay);
    } catch (error) {
        console.error('Failed to update essay:', error);
        res.status(400).json({ error: 'Failed to update essay' });
    }
}

async function preUpdateSideEssay(req, res, next) {
    try {
        const sideEssay = await EssayModel.findById(req.params.essayId);
        if (!sideEssay) { res.status(400).json({ error: "preUpdateMainEssay(): Failed to find main essay." }); }
        //delete inline images
        for (const img of sideEssay.inlineImagesS3Keys) {
            await deleteFromS3(img);
        }
        sideEssay.inlineImagesS3Keys = [];
        //delete cover image
        if (sideEssay.coverPhotoS3Key) {
            await deleteFromS3(sideEssay.coverPhotoS3Key);
        }
        sideEssay.coverPhotoS3Key = "null";
        //delete html
        if (sideEssay.htmlS3Key) {
            await deleteFromS3(sideEssay.htmlS3Key);
        }
        sideEssay.htmlS3Key = "null";

        await sideEssay.save();
        req.entity = sideEssay;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: "preUpdateMainEssay failed." });
    }
}

//Admin only
async function postUpdateSideEssay(req, res) {
    try {
        // Grab essay document
        const essay = req.entity;

        essay.coverPhotoS3Key = req.files.coverPhoto[0].key;

        // Process HTML file if uploaded
        let preview = essay.preview;
        if (req.files.html && req.files.html[0]) {
            const oldHtmlS3Key = essay.htmlS3Key;
            if (oldHtmlS3Key) {
                await deleteFromS3(oldHtmlS3Key);
            }

            const newHtmlS3Key = req.files.html[0].key;
            essay.htmlS3Key = newHtmlS3Key;
            const oldHTML = await downloadFromS3(newHtmlS3Key);

            // Format footnotes and edit image source
            const imagesKeysAndHTML = await formatEssay(oldHTML, essay._id.toString())
            // Update essay's inline image keys
            imagesKeysAndHTML.newImageKeys.forEach(imgKey => essay.inlineImagesS3Keys.push(imgKey));

            // Update the HTML content in S3
            const modifiedHtmlContent = imagesKeysAndHTML.html;
            await updateInS3(newHtmlS3Key, modifiedHtmlContent);

            // Update the preview
            preview = downsize(modifiedHtmlContent, { words: 20 });
        }

        // Update the main essay's title if provided
        essay.title = req.body.title || essay.title;
        essay.preview = preview;

        // Save the changes to the database
        await essay.save();

        res.status(200).json(essay);
    } catch (error) {
        console.error('Failed to update essay:', error);
        res.status(400).json({ error: 'Failed to update essay' });
    }
}

//Admin only
async function deleteEssayById(req, res) {
    try {
        const essayToDelete = await EssayModel.findById(req.params.essayId);
        if (!essayToDelete) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        await deleteFromS3(essayToDelete.htmlS3Key);
        if (essayToDelete.coverPhotoS3Key) { await deleteFromS3(essayToDelete.coverPhotoS3Key); }
        for (const imgKey of essayToDelete.inlineImagesS3Keys) {
            await deleteFromS3(imgKey);
        }
        await essayToDelete.deleteOne();
        res.status(200).json({ message: 'Content deleted successfully' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(400).json({ error: 'Failed to delete content.' });
    }
}

//All logged in users
async function starEssayById(req, res) {
    try {
        const essayId = req.params.essayId;
        const userId = req.user._id;
        const foundPost = await EssayModel.findById(essayId);
        if (!foundPost) {
            return res.status(404).json({ error: "Post not found." });
        }
        // Add the user's reference to the post's stars array
        await EssayModel.findByIdAndUpdate(
            essayId,
            { $addToSet: { stars: userId } },
            { new: true }
        );
        let post = await EssayModel.findById(essayId);
        const numStars = post.stars.length;
        post = await EssayModel.findByIdAndUpdate(
            essayId,
            { $set: { numStars } },
            { new: true }
        );
        res.status(200).json({ data: post, error: null });
    } catch (error) {
        console.error('Error starring post:', error);
        res.status(500).json({ error: 'Failed to star post' });
    }
}

//All logged in users
async function unstarEssayById(req, res) {
    try {
        const essayId = req.params.essayId;
        const userId = req.user._id;

        const foundPost = await EssayModel.findById(essayId);
        if (!foundPost) {
            return res.status(404).json({ error: "Post not found." });
        }
        let post = await EssayModel.findByIdAndUpdate(
            essayId,
            { $pull: { stars: userId } },
            { new: true }
        );
        post = await EssayModel.findById(essayId);
        const numStars = post.stars.length;
        post = await EssayModel.findByIdAndUpdate(
            essayId,
            { $set: { numStars } },
            { new: true }
        );
        res.status(200).json({ data: post, error: null });
    } catch (error) {
        console.error('Error unstarring post:', error);
        res.status(500).json({ error: 'Failed to unstar post' });
    }
}


module.exports = {
    //Create
    getDate,
    createEssay,
    //Read
    getMainEssay,
    getEssayById,
    //Previews
    getMainEssayPreview,
    getAllSideEssayPreviews,
    //Update
    updateMainEssay,
    preUpdateSideEssay,
    postUpdateSideEssay,
    starEssayById,
    unstarEssayById,
    //Delete
    deleteEssayById,
};
