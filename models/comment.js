const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  text: {
    type: String,
    required: true,
    trim: true,
    maxlength: 2000
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
  parent: {
    type: Schema.Types.ObjectId,
    ref: "Comment",
    default: null
  },
  isDeleted: {
    type: Boolean,
    required: true,
    default: false
  }

},
  {
    timestamps: true
  });


module.exports = mongoose.model('Comment', commentSchema);
