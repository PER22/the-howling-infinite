//controllers/comment.js:
const commentModel = require('../../models/comment');
const blogModel = require('../../models/blog');
const essayModel = require('../../models/essay');

async function createComment(req, res) {
  try {
    const { text, entityType, entityId } = req.body;
    if (!entityType || !entityId) {
      console.log("entityType: ", entityType);
      console.log("entityId: ", entityId);
      return res.status(400).json({ error: "Both entityType and entityId are required." });
    }
    if (!text) {
      return res.status(400).json({ error: "Comment text is required." });
    }
    if (entityType !== 'Essay' && entityType !== 'Blog'){
      return res.status(400).json({error: 'Invalid entity type'});
    }
    let modelToQuery;
    if (entityType === 'Blog') {
      modelToQuery = blogModel;
    } else if (entityType === 'Essay') {
      modelToQuery = essayModel;
    } else {
      return res.status(400).json({ error: 'Invalid entity type' });
    }
    const entity = await modelToQuery.findById(entityId);
    if (!entity) {
      return res.status(400).json({ error: `${entityType} does not exist` });         
    }

    const newComment = await commentModel.create({
      text,
      author : req.user._id,
      entityType,
      entityId,
      isApproved: req.user.isAdmin
    });

    return res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function getCommentById(req, res) {
  try {
    const requestedComment = commentModel.findById(req.params.commentId).populate("author");
    if (requestedComment) { return res.status(200).json(requestedComment); }
  } catch (err) {
    return res.status(200).json({ error: "Comment could not be located." });
  }
  res.status(200).json({ message: 'Get comment by ID not implemented yet' });
};

async function getCommentsByEntity(req, res){
  try {
    const entityType = req.params.entityType;
    const entityId = req.params.entityId;
    const requestedComments = await commentModel.find({entityType: entityType, entityId: entityId}).populate("author");
    if (requestedComments) { 
      return res.status(200).json(requestedComments); 
    }
    else{
      return [];
    }
  } catch (err) {
    res.status(404).json({error: "Failed to get comments by entity."});
  }
}


async function updateCommentById(req, res) {
  try {
    const newText = req.body.newText;
    if (!newText) {
      console.log("updateCommentById(): request.body did not contain newText");
      return res.status(400).json({ error: "request.body did not contain newText" });
    }
    const requestedComment = await commentModel.findById(req.params.commentId);
    if (requestedComment) {
      if (req.user._id.toString() === requestedComment.author._id.toString()) {
        requestedComment.text = newText;
        requestedComment.isApproved = false;
        await requestedComment.save();
        return res.status(200).json(requestedComment);
      }
      else {
        console.log("updateCommentById(): request.user._id does not match comment.author._id");
        return res.status(400).json({ error: "updateCommentById(): request.user._id does not match comment.author._id" });
      }
    } else {
      console.log("updateCommentById(): Requested comment not found.");
      return res.status(404).json({ error: "updateCommentById(): Requested comment not found." });
    }
  } catch (err) {
    console.log("updateCommentById(): ", err);
    return res.status(400).json({ error: 'Error updating comment by ID.' });
  }
};


async function deleteCommentById(req, res) {
  try {
    const commentToDelete = await commentModel.findById(req.params.commentId);
    if (commentToDelete) {
      if (req.user._id.toString() === commentToDelete.author._id.toString()) {
        await commentToDelete.remove();
        return res.status(200).json({success: "Comment deleted!"});
      }
      else {
        console.log("deleteCommentById(): request.user._id does not match comment.author._id");
        return res.status(400).json({ error: "deleteCommentById(): request.user._id does not match comment.author._id" });
      }
    } else {
      console.log("deleteCommentById(): Requested comment not found.");
      return res.status(404).json({ error: "deleteCommentById(): Requested comment not found." });
    }
  } catch (err) {
    console.log("deleteCommentById(): ", err);
    return res.status(400).json({ error: 'Error deleting comment by ID.' });
  }
};

// Fetch all unapproved comments
async function getAllUnapprovedComments(req, res) {
  try {
    const unapprovedComments = await commentModel.find({ isApproved: false });
    return res.status(200).json(unapprovedComments);
  } catch (err) {
    console.log("Error finding unapproved comments: ", err)
    return res.status(400).json({ error: "Error while finding unapproved comments."});
  }
};

async function approveComment(req, res) {
  try {
    const approvedComment = await commentModel.findByIdAndUpdate(
      req.params.contentId,
      { isApproved: true },
      { new: true });
    if(!approvedComment){
      console.error("approveComment(): Comment not found");
      return res.status(404).json({ error: "Comment not found." });
    }
    res.status(200).json(approvedComment);
  } catch (err) { 
    res.status(400).json({ error: "Error approving comment."}); 
  }
}

module.exports = {
  createComment,
  getCommentById,
  updateCommentById,
  deleteCommentById,
  getAllUnapprovedComments,
  approveComment, 
  getCommentsByEntity
};