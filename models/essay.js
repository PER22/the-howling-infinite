const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EssaySchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required:true
  },
  isMain: {
    type: Boolean,
    required: true,
    default: false
  },
  htmlS3Key: {
    type: String,
    required: true
  },
  coverPhotoS3Key: {
    type: String
  },
  inlineImagesS3Keys : [String],
  preview: {
    type: String
  },
  stars: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  numStars: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Essay', EssaySchema);
