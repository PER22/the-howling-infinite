import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { deleteCommentById } from "../../utilities/comments-service";
import { useLoggedInUser } from "../LoggedInUserContext/LoggedInUserContext";

export default function CommentCard({ comment, deleteInUI, setParentCommentId }) {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();

  const handleDelete = async () => {
    try {
      const response = await deleteCommentById(comment._id);
      if(!response.error){
        console.log("in theory no errors?");
        deleteInUI(comment._id);
      }
    } catch (err) {
      console.log("Error deleting comment.");
    }
  };

  const handleReplyClick = () => {
    setParentCommentId(comment._id);
  }

  return (
    <Card elevation={3} className="comment-card" sx={{ marginBottom: '1rem', width: '100%' }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: '0.5rem' }}>
        <Typography variant="subtitle1" className="comment-author">
          {comment.author.name}
        </Typography>
        <Typography variant="body2" className="comment-text">
          {comment.text}
        </Typography>
        <Typography variant="caption" className="comment-timestamp">
          {new Date(comment.createdAt).toLocaleString()}
        </Typography>
        {loggedInUser &&
          <IconButton size="small" onClick={handleReplyClick}sx={{ alignSelf: 'flex-end' }}>
            <AddIcon fontSize="inherit"/>
          </IconButton>
        }
        {((loggedInUser?._id === (comment.author._id || comment.author)) || (loggedInUser?.isAdmin)) &&
          <IconButton size="small" onClick={handleDelete} sx={{ alignSelf: 'flex-end' }}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        }
      </CardContent>
    </Card>
  );
}
