const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  article: {type: String, required: true},
  dateCreated: { type: Date, default: Date.now },
  stars: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  numStars: {type: Number, default: 0}
});

module.exports = mongoose.model('Post', PostSchema);
