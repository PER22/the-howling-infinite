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
    required: true,
    trim: true,
    maxlength: 80
  },
  preview: {
    type: String
  },
  isMain: {
    type: Boolean,
    required: true,
    default: false
  },
  coverPhotoS3Key: {
    type: String
  },
  htmlS3Key: {
    type: String
  },
  stars: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  numStars: { type: Number, default: 0 },
  chapterNumber: {
    type: Number,
    default: 1 ,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'error'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Essay', EssaySchema);
