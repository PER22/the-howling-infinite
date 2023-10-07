const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000
  },
  isApproved: {
    type: Boolean,
    required: true,
    default: false
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  entityType: { 
    type: String, 
    enum: ["Blog", "Essay"], 
    required: true 
  },
  entityId: { 
    type: Schema.Types.ObjectId, 
    required: true 
  }
},
  {
    timestamps: true
  });


module.exports = mongoose.model('Comment', commentSchema);
