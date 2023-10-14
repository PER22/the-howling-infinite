const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const profileSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  bio_string: { type: String, maxlength: 1000, default: "You have not yet updated your Bio page." },
  profilePicture: { type: String, default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" },
  github_link: {type: String, maxlength: 300}
}, {
  timestamps: true
});

module.exports = mongoose.model('Profile', profileSchema);
