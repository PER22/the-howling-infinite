const { generatePresignedS3DownloadURL} = require('../../utilities/aws');

async function fetchPublicImageURL(req, res) {
    try {
        const imageTitle = decodeURIComponent(req.params.imageTitle);
        const signedURL = await generatePresignedS3DownloadURL(imageTitle);
        if (signedURL) {
            res.status(200).json({ url: signedURL }); 
        } else {
            res.status(500).send("Error generating signed URL");
        }
    } catch (err) {
        console.log("Error fetching signed URL:", err);
        res.status(500).send("Internal server error");
    }
}


module.exports = { fetchPublicImageURL };
