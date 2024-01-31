const postmark = require("postmark");
const User = require('../../models/user');

async function sendMessage(req, res) {
    try {
        const { text } = req.body;
        const user = req.user;
        console.log(user);
        if (!text) {
            return res.status(400).json({ error: "Message text is required." });
        }

        var client = new postmark.ServerClient(process.env.POSTMARK_KEY);
        await client.sendEmail({
            "From": `${process.env.EMAIL_FROM}`,
            "To": 'OswaldPortrait@gmail.com',
            "Subject": "Message from a reader of The-Howling-Infinite.com",
            "HtmlBody": `<p>Message: ${text}</p> <p>Sent by user: ${user.name}. Reply to them at ${user.email}</p>`,
            "TextBody": `${text}`,
            "MessageStream": "outbound"
        });
        return res.status(201).json({ message: "Message successfully sent. Thanks for reaching out!" });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    sendMessage
};