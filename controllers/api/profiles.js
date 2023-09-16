const Profile = require('../../models/profile');
const Post = require('../../models/post');
const User = require('../../models/user');
const Project = require('../../models/project');

module.exports = {
    allProfiles,
    getProfileById,
    updateProfile,
    deleteProfile
}

async function allProfiles(req, res){
  try{
      const profiles = await Profile.find().populate('user');
      res.status(200).json(profiles)
  }catch(err){
      // console.log(err)
      res.status(400).json(err)
  }
}

async function getProfileById(req, res){
    try{
        const profile = await Profile.findOne({_id: req.params.profileId}).populate('user');
        res.status(200).json(profile)
    }catch(err){
        // console.log(err)
        res.status(400).json(err)
    }
}

async function updateProfile(req, res) {
    try {
        const selectedProfile = await Profile.findOne({_id: req.params.profileId}).populate("user");
        if (selectedProfile.user._id.toHexString() === req.user._id){
          const updatedProfile = await Profile.findOneAndUpdate(
            { _id: req.params.profileId},
            { bio_string: req.body.bio_string || "", profilePicture: req.body.profilePicture || "", github_link : req.body.github_link || "" },
            { new: true }
          ).populate("user");
          return res.status(200).json(updatedProfile);
        }else{
          return res.status(403).json({ error: "You don't have edit access to that!" })
        }
        
    } catch (err) {
      // console.log(err);
      res.status(400).json(err);
    }
}
  
async function deleteProfile(req, res) {
    try {
      let selectedProfile = await Profile.findOne({ _id: req.params.profileId}).populate("user"); 
      if(!selectedProfile){
        return res.status(404).json({error: "Profile not found."});
      }
      if(selectedProfile.user._id.toHexString() === req.user._id){
        await Project.updateMany({ stars: selectedProfile.user._id }, { $pull: { stars: selectedProfile.user._id} });
        await Project.deleteMany({user: selectedProfile.user._id});
        await Post.deleteMany({user: selectedProfile.user._id});
        await Profile.findOneAndDelete({_id: req.params.profileId});
        await User.findOneAndDelete({_id: selectedProfile.user._id.toHexString()});
      }else{
        return res.status(403).json({ error: "You don't have edit access to that." })
      }
      res.status(200).json({ message: 'Profile deleted.' });
    } catch (error) {
      // console.log(error);
      res.status(400).json(error);
    }
}



  