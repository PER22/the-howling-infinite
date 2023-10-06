const { generatePresignedS3DownloadURL: generateSignedURL } = require('../../utilities/aws');

async function fetchPublicImageURL(req, res) {
    try {
        const imageTitle = req.params.imageTitle;
        const signedURL = await generateSignedURL(imageTitle);
        if (signedURL) {
            res.redirect(signedURL);
        } else {
            res.status(500).send("Error generating signed URL");
        }
    } catch (err) {
        console.log("Error fetching signed URL:", err);
        res.status(500).send("Internal server error");
    }
}

module.exports = { fetchPublicImageURL };
