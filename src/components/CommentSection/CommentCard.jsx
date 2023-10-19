import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteCommentById } from "../../utilities/comments-service";
import { useLoggedInUser } from "../LoggedInUserContext/LoggedInUserContext";

export default function CommentCard({ comment, removeCardFromUI }) {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();

  const handleDelete = async () => {
    try {
      await deleteCommentById(comment._id);
      removeCardFromUI(comment._id);
    } catch (err) {
      // Handle error if needed.
    }
  };

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
        {((loggedInUser?._id === comment.author._id) || (loggedInUser.isAdmin)) && 
          <IconButton size="small" onClick={handleDelete} sx={{ alignSelf: 'flex-end' }}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        }
      </CardContent>
    </Card>
  );
}
