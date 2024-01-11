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
    required: true
  },
  isMain: {
    type: Boolean,
    required: true,
    default: false
  },
  sections: [{
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true,
    default: []
  }],
  coverPhotoS3Key: {
    type: String,
    default: null
  },
  stars: [{
    type: Schema.Types.ObjectId,
    ref: 'User', 
    default: []
  }],
  numStars: {
    type: Number,
    default: 0
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Essay', EssaySchema);
