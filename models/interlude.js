const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Section = require('./section');

const InterludeSchema = new Schema({
    youtubeLink: {
        type: String,
        required: true
    }
});


module.exports = Section.discriminator('Interlude', InterludeSchema);
