const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500
    },
    isApproved:{
      type: Boolean,
      required: true,
      default: false
    },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',  
      required: true
    },
    parent: {
      id: {
        type: Schema.Types.ObjectId,
        required: true
      },
      type: {
        type: String,
        enum: ['MainEssay', 'SideEssay', 'BlogPost'],
        required: true
      }
    }
  }, 
  {
    timestamps: true
});

  
module.exports = mongoose.model('Comment', commentSchema);
  