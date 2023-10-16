//controllers/essay.js:


const EssayModel = require('../../models/essay');
const { downloadFromS3, deleteFromS3, updateInS3, sanitizeTitleForS3 } = require('../../utilities/aws');
const downsize = require("downsize");
const cheerio = require('cheerio');

//Admin only
async function preCreateEssay(req, res, next) {
    try {
        // Create the essay without actual content just to get _id back
        const newEssay = await EssayModel.create({
            title: "temporary",
            author: req.user?._id,
            isMain: true,
            htmlS3Key: "not a real key"
        });
        console.log(newEssay);
        // Attach the newEssay to the req object
        req.essay = newEssay;

        // Move to the next middleware (which should be multer)
        next();
    } catch (error) {
        console.error('Error during preCreateEssay middleware:', error);
        res.status(400).json({ error: 'Failed during preCreateEssay middleware' });
    }
}

function formatFootnotes(oldHTML){
    const $ = cheerio.load(oldHTML);
            const footnotes = {};

            // Collect all the footnotes
            $('a[href^="#_ftnref"]').each((i, element) => {
                const href = $(element).attr('href');
                const footnoteId = href.replace("#_ftnref", "");
                const content = $(element).closest('p').text();
                footnotes[footnoteId] = content;
            });

            // Replace the navigation links with tooltips
            $('a[href^="#_ftn"]').each((i, element) => {
                const href = $(element).attr('href');
                const footnoteId = href.replace("#_ftn", "");
                const footnoteNumber = footnoteId.replace("ref", "");
                if (footnotes[footnoteId]) {
                    const replacementHTML = `<span data-footnote-content="${footnotes[footnoteId]}" data-footnote-number="${footnoteNumber}"> [${footnoteNumber}]</span>`;
                    $(element).replaceWith(replacementHTML);
                }
            });
            $('div[style*="mso-element:footnote"]').remove();
            return $.html();
}

function editImgSrc(oldHTML, postId){
    const $ = cheerio.load(oldHTML);
    const finalImageKeys = [];
    $('img').each((index, img) => {
        const src = $(img).attr('src');
        const fileName = src.split('/').pop();
        const newSrc = `/api/images/essayimages-${postId}-${sanitizeTitleForS3(fileName)}`;
        $(img).attr('src', newSrc);
        finalImageKeys.push(`essayimages-${postId}-${sanitizeTitleForS3(fileName)}`)
    });
    return {html: $.html(), newImageKeys: finalImageKeys}; 
}

//Admin only
async function postCreateEssay(req, res) {
    try {
        let coverPhotoS3Key = null;
        let htmlS3Key = null;
        const folderFiles = [];
        if(!req.file && !req.files){console.log("Files are not attached.")}

        if (req.files.coverPhoto && req.files.coverPhoto[0]) {
            coverPhotoS3Key = req.files.coverPhoto[0].key;
        }
        if (req.files.html && req.files.html[0]) {
            htmlS3Key = req.files.html[0].key;
        }
        if (req.files.folderFiles) {
            for (let file of req.files.folderFiles) {
                folderFiles.push(file.key);
            }
        }
        let preview = "";
        if (htmlS3Key) {
            const oldHTML = await downloadFromS3(htmlS3Key);
            const htmlWithFootnotes = formatFootnotes(oldHTML);
            const imagesKeysAndHTML = editImgSrc(htmlWithFootnotes, req.essay._id.toString());
            imagesKeysAndHTML.newImageKeys.forEach((imgKey)=>{
                req.essay.inlineImagesS3Keys.push(imgKey)    
            });
            const modifiedHtmlContent = imagesKeysAndHTML.html;
            await updateInS3(htmlS3Key, modifiedHtmlContent);
            preview = downsize(modifiedHtmlContent, { words: 20, append: "..." });
        }
        req.essay.title = req.body.title
        req.essay.isMain = req.body.isMain
        req.essay.htmlS3Key = htmlS3Key;
        req.essay.status = "completed";
        req.essay.coverPhotoS3Key = coverPhotoS3Key;
        req.essay.preview = preview;
        await req.essay.save();
        res.status(201).json(req.essay);
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(400).json({ error: 'Failed to create content' });
    }
}

//Anonymous
async function getMainEssay(req, res) {
    try {
        const essay = await EssayModel.findOne({ isMain: true }).populate('author');
        if (!essay) {
            return res.status(404).json({ error: 'Essay not found.' });
        }
        const contentBody = await downloadFromS3(essay.htmlS3Key);
        const essayObj = essay.toObject();
        essayObj.bodyHTML = contentBody;
        res.status(200).json(essayObj);
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
async function getAllSideEssayPreviews(req, res) {
    try {
        const essays = await EssayModel.find({ isMain: false}).populate('author');
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
//Admin only
async function preUpdateMainEssay(req, res, next) {
    try {
        const mainEssay = await EssayModel.findOne({ isMain: true });
        if(!mainEssay){res.status(400).json({ error: "preUpdateMainEssay(): Failed to find main essay." });}
        //delete inline images
        for (const img of mainEssay.inlineImagesS3Keys) {
            await deleteFromS3(img);
        }
        mainEssay.inlineImagesS3Keys = [];
        //delete cover image
        if(mainEssay.coverPhotoS3Key){
            await deleteFromS3(mainEssay.coverPhotoS3Key);
        }
        mainEssay.coverPhotoS3Key = "null";
        //delete html
        if(mainEssay.htmlS3Key){
            await deleteFromS3(mainEssay.htmlS3Key);
        }
        mainEssay.htmlS3Key = "null";

        await mainEssay.save();
        req.essay = mainEssay;
        next();
    } catch (err) {
        console.log(err.message);
        return res.status(400).json({ error: "preUpdateMainEssay failed." });
    }
}

//Admin only
async function postUpdateMainEssay(req, res) {
    try {
        // Grab essay document
        const mainEssay = req.essay;

        // Check authorship against the requesting user
        if (req.user._id.toString() !== mainEssay.author.toString()) {
            return res.status(403).json({ error: "You don't have permission to edit the main essay." });
        }
        mainEssay.coverPhotoS3Key = req.files.coverPhoto[0].key;

        // Process HTML file if uploaded
        let preview = mainEssay.preview;
        if (req.files.html && req.files.html[0]) {
            const oldHtmlS3Key = mainEssay.htmlS3Key;
            if (oldHtmlS3Key) {
                await deleteFromS3(oldHtmlS3Key);
            }

            const newHtmlS3Key = req.files.html[0].key;
            mainEssay.htmlS3Key = newHtmlS3Key;
            const oldHTML = await downloadFromS3(newHtmlS3Key);


            // Format footnotes and edit image source
            const htmlWithFootnotes = formatFootnotes(oldHTML);
            const imagesKeysAndHTML = editImgSrc(htmlWithFootnotes, mainEssay._id.toString());

            // Update essay's inline image keys
            imagesKeysAndHTML.newImageKeys.forEach(imgKey => mainEssay.inlineImagesS3Keys.push(imgKey));

            // Update the HTML content in S3
            const modifiedHtmlContent = imagesKeysAndHTML.html;
            await updateInS3(newHtmlS3Key, modifiedHtmlContent);

            // Update the preview
            preview = downsize(modifiedHtmlContent, { words: 20, append: "..." });
        }

        // Update the main essay's title if provided
        mainEssay.title = req.body.title || mainEssay.title;
        mainEssay.preview = preview;

        // Save the changes to the database
        await mainEssay.save();

        res.status(200).json(mainEssay);
    } catch (error) {
        console.error('Failed to update essay:', error);
        res.status(400).json({ error: 'Failed to update essay' });
    }
}

async function preUpdateSideEssay(req, res, next) {
    try {
        const sideEssay = await EssayModel.findById( req.params.essayId );
        if(!sideEssay){res.status(400).json({ error: "preUpdateMainEssay(): Failed to find main essay." });}
        //delete inline images
        for (const img of sideEssay.inlineImagesS3Keys) {
            await deleteFromS3(img);
        }
        sideEssay.inlineImagesS3Keys = [];
        //delete cover image
        if(sideEssay.coverPhotoS3Key){
            await deleteFromS3(sideEssay.coverPhotoS3Key);
        }
        sideEssay.coverPhotoS3Key = "null";
        //delete html
        if(sideEssay.htmlS3Key){
            await deleteFromS3(sideEssay.htmlS3Key);
        }
        sideEssay.htmlS3Key = "null";

        await sideEssay.save();
        req.essay = sideEssay;
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
        const essay = req.essay;

        // Check authorship against the requesting user
        if (req.user._id.toString() !== essay.author.toString()) {
            return res.status(403).json({ error: "You don't have permission to edit the main essay." });
        }
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
            const htmlWithFootnotes = formatFootnotes(oldHTML);
            const imagesKeysAndHTML = editImgSrc(htmlWithFootnotes, essay._id.toString());

            // Update essay's inline image keys
            imagesKeysAndHTML.newImageKeys.forEach(imgKey => essay.inlineImagesS3Keys.push(imgKey));

            // Update the HTML content in S3
            const modifiedHtmlContent = imagesKeysAndHTML.html;
            await updateInS3(newHtmlS3Key, modifiedHtmlContent);

            // Update the preview
            preview = downsize(modifiedHtmlContent, { words: 20, append: "..." });
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
        const content = await EssayModel.findById(req.params.contentId);
        if (!content) {
            return res.status(404).json({ error: 'Cont not found.' });
        }
        if (req.user._id !== content.author.toString()) {
            return res.status(403).json({ error: "You don't have permission to delete this content." });
        }
        await deleteFromS3(content.contentS3Key);
        if (content.coverPhotoS3Key) { await deleteFromS3(content.coverPhotoS3Key); }
        await content.remove();
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
            return res.status(404).json({ eror: "Post not found." });
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
        res.status(200).json(post);
    } catch (error) {
        console.error('Error starring post:', error);
        res.status(500).json({ error: 'Failed to star post' });
    }
}

//All logged in users
async function unstarEssayById(req, res) {
    try {
        const postId = req.params.postId;
        const userId = req.user._id;

        const foundPost = await EssayModel.findById(postId);
        if (!foundPost) {
            return res.status(404).json({ eror: "Post not found." });
        }
        let post = await EssayModel.findByIdAndUpdate(
            postId,
            { $pull: { stars: userId } },
            { new: true }
        );
        post = await EssayModel.findById(postId);
        const numStars = post.stars.length;
        post = await EssayModel.findByIdAndUpdate(
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
    preCreateEssay,
    postCreateEssay,
    //Read
    getMainEssay,
    getEssayById,
    //Previews
    getMainEssayPreview,
    getAllSideEssayPreviews,
    //Update
    preUpdateMainEssay,
    postUpdateMainEssay,
    preUpdateSideEssay,
    postUpdateSideEssay,
    starEssayById,
    unstarEssayById,
    //Delete
    deleteEssayById,
};
