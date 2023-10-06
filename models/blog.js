const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  preview: {
    type: String,
    required: true
  },
  htmlS3Key: {
    type: String,
    required: true
  },
  coverPhotoS3Key: {
    type: String
  },
  stars: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  numStars: { type: Number, default: 0 },
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', BlogSchema);
