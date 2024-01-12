const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    index: {
        type: Number,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    coverPhotoS3Key: {
        type: String
    }
}, {
    timestamps: true,
    discriminatorKey: 'type'
});

module.exports = mongoose.model('Section', SectionSchema);
