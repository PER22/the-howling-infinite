//controllers/comment.js:
const commentModel = require('../../models/comment');

async function createComment(req, res) {
  try {
    const { text, parentCommentId } = req.body;

    if (!text) {
      return res.status(400).json({ error: "Comment text is required." });
    }

    if (parentCommentId) {
      const parentComment = await commentModel.findById(parentCommentId);
      if (!parentComment) {
        return res.status(404).json({ error: "Invalid parent comment." });
      }
    }

    const newComment = await commentModel.create({
      text,
      author: req.user._id,
      isApproved: req.user.isAdmin,
      parent: parentCommentId || null
    });
    const populatedComment = await commentModel.findById(newComment._id).populate({path: 'author',
    select: '-password -createdAt -updatedAt'});


    return res.status(201).json(populatedComment);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};


async function getCommentById(req, res) {
  try {
    const requestedComment = await commentModel.findById(req.params.commentId).populate({path: 'author',
    select: '-password -createdAt -updatedAt'});
    if (requestedComment) { return res.status(200).json(requestedComment); }
  } catch (err) {
    return res.status(200).json({ error: "Comment could not be located." });
  }
  res.status(200).json({ message: 'Get comment by ID not implemented yet' });
};

async function getComments(req, res) {
  try {
    let requestedComments;
    if (req.user) {
      // Fetch all approved comments and unapproved comments by the logged-in user
      requestedComments = await commentModel.find({
        $or: [
          { isApproved: true },
          { author: req.user._id, isApproved: false }
        ]
      }).populate("author");
      requestedComments = requestedComments.map(eachComment => {
        if (eachComment.isDeleted) { eachComment.text = "[deleted]"; }
        return eachComment;
      });
    } else {
      // Fetch only approved comments for users not logged in
      requestedComments = await commentModel.find({ isApproved: true }).populate({path: 'author',
      select: '-password -createdAt -updatedAt'});
    }

    if (requestedComments) {
      return res.status(200).json(requestedComments);
    } else {
      return res.status(404).json({ error: "No comments found." });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to get comments." });
  }
}


async function editCommentById(req, res) {
  console.log("Entering editCommentById");
  console.log(req.body);
  try {
    const newText = req.body.newText;
    console.log(newText);
    if (!newText) {
      return res.status(400).json({ error: "request.body did not contain newText" });
    }
    const requestedComment = await commentModel.findById(req.params.commentId).populate({path: 'author',
    select: '-password -createdAt -updatedAt'});

    if (requestedComment) {
      console.log("found comment!");
      if (req.user._id.toString() === requestedComment.author._id.toString()) {
        console.log("Author is the same as original");
        requestedComment.text = newText;
        requestedComment.isApproved = requestedComment.author.isAdmin;
        console.log("Approve handled.");
        let response = await requestedComment.save();
        console.log(response);
        console.log("comment updated in database.");
        const populatedComment = await commentModel.findById(requestedComment._id).populate({path: 'author',
        select: '-password -createdAt -updatedAt'});
        return res.status(200).json(populatedComment);
      }
      else {
        return res.status(401).json({ error: "request.user._id does not match comment.author._id" });
      }
    } else {
      return res.status(404).json({ error: "Requested comment not found." });
    }
  } catch (err) {
    console.log(err);
    return res.status(409).json({ error: err.message });
  }
};

async function deleteCommentById(req, res) {
  try {
    const commentToDelete = await commentModel.findById(req.params.commentId).populate({path: 'author',
    select: '-password -createdAt -updatedAt'});

    if (commentToDelete) {
      if (req.user._id.toString() === commentToDelete.author._id.toString() || req.user.isAdmin) {

        // Check for children of this comment
        const childrenCount = await commentModel.countDocuments({ parent: commentToDelete._id });

        if (childrenCount > 0) {
          // If the comment has children, mark it using .isDeleted
          commentToDelete.isDeleted = true;
          await commentToDelete.save();

          return res.status(200).json({ message: "Comment marked as [deleted].", softDelete: true });
        } else {
          // If the comment has no children, delete it
          await commentToDelete.deleteOne();
          return res.status(200).json({ message: "Comment deleted!", hardDelete: true });
        }

      } else {
        return res.status(400).json({ error: "You can only delete comments you wrote, unless you are an administrator." });
      }
    } else {
      console.log("deleteCommentById(): Comment not found.");
      return res.status(404).json({ error: "Comment not found." });
    }
  } catch (err) {
    console.log("deleteCommentById(): ", err);
    return res.status(400).json({ error: 'Error deleting comment by ID.' });
  }
};


// Fetch all unapproved comments
async function getAllUnapprovedComments(req, res) {
  try {
    const unapprovedComments = await commentModel.find({ isApproved: false }).populate({path: 'author',
    select: '-password -createdAt -updatedAt'});
    return res.status(200).json(unapprovedComments);
  } catch (err) {
    console.log("Error finding unapproved comments: ", err)
    return res.status(400).json({ error: "Error while finding unapproved comments." });
  }
};

async function approveCommentById(req, res) {
  try {
    const approvedComment = await commentModel.findByIdAndUpdate(
      req.params.commentId,
      { isApproved: true },
      { new: true });
    if (!approvedComment) {
      console.error("approveComment(): Comment not found");
      return res.status(404).json({ error: "Comment not found." });
    }
    res.status(200).json(approvedComment);
  } catch (err) {
    res.status(400).json({ data: null, error: `${err.message}` });
  }
}

module.exports = {
  createComment,
  getCommentById,
  editCommentById,
  deleteCommentById,
  getAllUnapprovedComments,
  approveCommentById,
  getComments
};