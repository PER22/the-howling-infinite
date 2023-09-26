const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const essaySchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 80
  },
  isMain:{
    type: Boolean,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  essayS3Key: { 
    type: String,
    required: true
  },
  coverPhotoS3Key : {
    type: String
  }
}, {
  timestamps: true  
});

module.exports = mongoose.model('Essay', essaySchema);
