import { useEffect, useState } from "react";
import RecursiveComment from "./RecursiveComment";
import { List, Card, CardContent, Typography } from "@mui/material";
export default function CommentDisplaySection({ comments, setComments, setParentCommentId }) {

  const removeCardFromUI = (commentId) => {
    setComments((prevComments) => prevComments.filter((comment) => comment._id !== commentId));
  };
  const [commentTree, setCommentTree] = useState([]);

  useEffect(() => {
    function createCommentTree(comments) {
      const commentMap = {};
      const commentTree = [];

      comments.forEach(comment => {
        comment.replies = [];  // Initialize an empty replies array for each comment.
        commentMap[comment._id] = comment;
      });

      comments.forEach(comment => {
        if (comment.parent) {
          // If this comment has a parent, push it into the parent's replies array.
          commentMap[comment.parent].replies.push(comment);
        } else {
          // If this comment doesn't have a parent, it's a top-level comment.
          commentTree.push(comment);
        }
      });
      setCommentTree(commentTree);
    };
    createCommentTree(comments);
  }, [comments]);



  return (
    <List className="comment-section" disablePadding={true} sx={{ marginTop: 2 }}>
      {commentTree?.length > 0 ? (
        commentTree.map(comment => (
          <RecursiveComment key={comment._id} comment={comment} removeCardFromUI={removeCardFromUI} setParentCommentId={setParentCommentId} />
        ))
      ) : (
        <Card sx={{ marginTop: '1rem' }}>
          <CardContent>
            <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
              No comments yet!
            </Typography>
          </CardContent>
        </Card>
      )}
    </List>
  );
}
