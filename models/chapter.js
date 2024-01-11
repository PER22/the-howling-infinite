const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Section = require('./section');

const ChapterSchema = new Schema({
    number: {
        type: Number,
        required: true
    },
    pdfS3Key: {
        type: String,
        required: true
    },
});


module.exports = Section.discriminator('Chapter', ChapterSchema);