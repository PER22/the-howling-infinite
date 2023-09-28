const Comment = require('../../models/comment');


async function createComment (req, res) {
  try {
    const { content, parentId, parentType } = req.body;
    const author = req.user._id; 

    const newComment = new Comment({
      content,
      author,
      parent: { id: parentId, type: parentType },
    });

    await newComment.save();

    return res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


async function getCommentById(req, res){
  
  res.status(200).json({ message: 'Get comment by ID not implemented yet' });
};


async function updateCommentById(req, res){
  
  res.status(200).json({ message: 'Update comment by ID not implemented yet' });
};


async function deleteCommentById(req, res){
  res.status(200).json({ message: 'Delete comment by ID not implemented yet' });
};

// Fetch all comments for a specific parent resource
async function getCommentsByParent(req, res){
  res.status(200).json({ message: 'Get comments by parent not implemented yet' });
};

// Fetch all unapproved comments
async function getAllUnapprovedComments(req, res){
  res.status(200).json({ message: 'Get all unapproved comments not implemented yet' });
};

module.exports = {
    createComment,
    getCommentById,
    updateCommentById,
    deleteCommentById,
    getCommentsByParent,
    getAllUnapprovedComments
};