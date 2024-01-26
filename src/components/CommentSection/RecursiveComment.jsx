import { ListItem } from "@mui/material";
import CommentCard from "./CommentCard";
export default function RecursiveComment({ comment, removeCardFromUI, setParentCommentId }) {
    return (
      <div>
        <ListItem disablePadding={true}>
          <CommentCard comment={comment} removeCardFromUI={removeCardFromUI} setParentCommentId={setParentCommentId}/>
        </ListItem>
  
        {comment.replies.length > 0 && comment.replies.map(reply => (
          <div style={{ marginLeft: '20px' }} key={reply._id}>
            <RecursiveComment comment={reply} removeCardFromUI={removeCardFromUI} setParentCommentId={setParentCommentId} />
          </div>
        ))}
      </div>
    );
  }