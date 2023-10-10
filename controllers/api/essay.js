    //controllers/essay.js:


    const EssayModel = require('../../models/essay');
    const { downloadFromS3, deleteFromS3, updateInS3, sanitizeTitleForS3 } = require('../../utilities/aws');
    const downsize = require("downsize");
    const cheerio = require('cheerio');

    //Admin only
    async function preCreateEssay(req, res, next) {
        console.log("Entering preCreateEssay()");
        try {
            // Create the essay without actual content just to get _id back
            const newEssay = await EssayModel.create({
                title : "temporary",
                author: req.user?._id,
                isMain: true,
                htmlS3Key: "not a real key"
            });
            console.log("newEssay: ", newEssay);

            // Attach the newEssay to the req object
            req.newEssay = newEssay;

            // Move to the next middleware (which should be multer)
            next();
        } catch (error) {
            console.error('Error during preCreateEssay middleware:', error);
            res.status(400).json({ error: 'Failed during preCreateEssay middleware' });
        }
    }

    //Admin only
    async function postCreateEssay(req, res) {
        try {
            let coverPhotoS3Key = null;
            let htmlS3Key = null;
            const folderFiles = [];
            
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
            if(htmlS3Key){
                const oldHTML = await downloadFromS3(htmlS3Key);
                const $ = cheerio.load(oldHTML);
                const footnotes = {};

                // Collect all the footnotes
                $('a[href^="#_ftnref"]').each((i, element) => {
                    const href = $(element).attr('href');
                    const footnoteId = href.replace("#_ftnref", "");
                    const content = $(element).parent().text().trim().replace(/\[\d+\]/, '');  // Remove the [number] from the start
                    footnotes[footnoteId] = content;
                    console.log(`Found footnote ${footnoteId}: ${content}`);
                });
                
                // Replace the navigation links with tooltips
                $('a[href^="#_ftn"]').each((i, element) => {
                    const href = $(element).attr('href');
                    const footnoteId = href.replace("#_ftn", "");
                    if (footnotes[footnoteId]) {
                        $(element).replaceWith(`<span class="footnote-ref" data-tooltip="${footnotes[footnoteId]}">[${footnoteId}]</span>`);
                        console.log(`Replaced navigation link for footnote ${footnoteId}`);
                    }
                });
                $('div[style*="mso-element:footnote"]').remove();   
                $('img').each((index, img) => {
                    const src = $(img).attr('src');
                    const fileName = src.split('/').pop();
                    const newSrc = `/api/images/essayimages-${req.newEssay._id}-${sanitizeTitleForS3(fileName)}`;
                    $(img).attr('src', newSrc);
                });
                const modifiedHtmlContent = $.html();
                await updateInS3(htmlS3Key, modifiedHtmlContent);
                preview = downsize(modifiedHtmlContent , {words: 20, append: "..."});
            }
            req.newEssay.title = req.body.title
            req.newEssay.isMain = req.body.isMain
            req.newEssay.htmlS3Key = htmlS3Key;
            req.newEssay.status = "completed";
            req.newEssay.coverPhotoS3Key = coverPhotoS3Key;
            req.newEssay.preview = preview;
            await req.newEssay.save();
            res.status(201).json({ essay:  req.newEssay});
        } catch (error) {
            console.error('Error creating content:', error);
            res.status(400).json({ error: 'Failed to create content' });
        }
    }

    //Anonymous
    async function getMainEssay(req, res) {
        try {
            const essay = await EssayModel.findOne({ isMain: true}).populate('author');
            if (!essay) {
                return res.status(404).json({ error: 'Essay not found.' });
            }
            console.log("essay.htmlS3Key: ", essay.htmlS3Key);
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
            const content = await EssayModel.findById(req.params.contentId).populate('author');
            if (!content) {
                return res.status(404).json({ error: 'Content not found.' });
            }
            const contentBody = await downloadFromS3(content.contentS3Key);
            res.status(200).json({ ...content.toObject(), bodyText: contentBody.toString() });
        } catch (error) {
            console.error('Error fetching content:', error);
            res.status(400).json({ error: 'Failed to fetch content' });
        }
    }

    //Anonymous
    async function getMainEssayPreviews(req, res) {
        try {
            const essay = await EssayModel.findOne({ isMain: true }).populate('author');
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
            const essays = await EssayModel.find({ isMain: false, type: 'essay' }).populate('author');
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
    async function preUpdateMainEsssay(req, res, next){
        try{
            const mainEssay = await EssayModel.findOne({isMain: true});
            req.contentId = mainEssay._id;
            next();
        }catch(err){
            res.status(400).json({error: "preUpdateMainEssay failed."});
        }
    }

    //Admin only
    async function updateMainEssay(req, res) {
        try {
            const mainEssay = await EssayModel.findOne({ isMain: true });

            if (!mainEssay) {
                return res.status(404).json({ error: 'Main essay not found.' });
            }

            if (req.user._id.toString() !== mainEssay.author.toString()) {
                return res.status(403).json({ error: "You don't have permission to edit the main essay." });
            }

            let coverPhotoS3Key = mainEssay.coverPhotoS3Key;
            let htmlS3Key = mainEssay.htmlS3Key;
            let preview = "";

            if (req.files.coverPhoto && req.files.coverPhoto[0]) {
                coverPhotoS3Key = req.files.coverPhoto[0].key;
                // Delete the old cover photo from S3 if there's a new one
                await deleteFromS3(mainEssay.coverPhotoS3Key);
            }

            if (req.files.html && req.files.html[0]) {
                htmlS3Key = req.files.html[0].key;

                const oldHTML = await downloadFromS3(htmlS3Key);
                const $ = cheerio.load(oldHTML);

                $('img').each((index, img) => {
                    const src = $(img).attr('src');
                    const fileName = src.split('/').pop();
                    const newSrc = `/api/images/essayimages-${mainEssay._id}-${sanitizeTitleForS3(fileName)}`;
                    $(img).attr('src', newSrc);
                });

                const modifiedHtmlContent = $.html();
                await updateInS3(htmlS3Key, modifiedHtmlContent);
                preview = downsize(modifiedHtmlContent, { words: 20, append: "..." });
            }

            mainEssay.title = req.body.title || mainEssay.title;
            mainEssay.htmlS3Key = htmlS3Key;
            mainEssay.coverPhotoS3Key = coverPhotoS3Key;
            mainEssay.preview = preview;
            await mainEssay.save();

            res.status(200).json(mainEssay);
        } catch (error) {
            console.error('Failed to update essay:', error);
            res.status(400).json({ error: 'Failed to update essay' });
        }
    }


    //Admin only
    async function updateEssayById(req, res) {
        try {
            const { title, bodyText } = req.body; //User can only affect title and body text
            const content = await EssayModel.findById(req.params.contentId);
            if (!content) {
                return res.status(404).json({ error: 'Content not found.' });
            }
            if (req.user._id !== content.author.toString()) {
                return res.status(403).json({ error: "You don't have permission to edit this content." });
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
            if (oldS3Key) {
                deleteFromS3(req.file.key);
            }
            if (bodyText) {
                await updateInS3(content.contentS3Key, bodyText);
                content.preview = downsize(bodyText, { words: 20, append: "..." });
            }
            await content.save();
            res.status(200).json(content);
        } catch (error) {
            console.error('Error updating content:', error);
            res.status(400).json({ error: 'Failed to update content' });
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
            const postId = req.params.postId;
            const userId = req.user._id;
            const foundPost = await EssayModel.findById(postId);
            if (!foundPost) {
                return res.status(404).json({ eror: "Post not found." });
            }
            // Add the user's reference to the post's stars array
            await EssayModel.findByIdAndUpdate(
                postId,
                { $addToSet: { stars: userId } },
                { new: true }
            );
            let post = await EssayModel.findById(postId);
            const numStars = post.stars.length;
            post = await EssayModel.findByIdAndUpdate(
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
        getMainEssayPreviews,
        getAllSideEssayPreviews,
        //Update
        preUpdateMainEsssay,
        updateMainEssay,
        updateEssayById,
        starEssayById,
        unstarEssayById,
        //Delete
        deleteEssayById,
    };
