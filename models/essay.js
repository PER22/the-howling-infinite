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
  awsFileKey: { 
    type: String,
    required: true
  }
}, {
  timestamps: true  // This will automatically add createdAt and updatedAt fields
});

module.exports = mongoose.model('Essay', essaySchema);
