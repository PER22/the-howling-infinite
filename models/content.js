const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContentSchema = new Schema({
  type: {
    type: String,
    enum: ['essay', 'blog'],
    required: true
  },
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
  isMain: {
    type: Boolean,
    required: true,
    default: false
  },
  contentS3Key: {
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

module.exports = mongoose.model('Content', ContentSchema);
