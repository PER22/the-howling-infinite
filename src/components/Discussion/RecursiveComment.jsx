import { ListItem } from "@mui/material";
import CommentCard from "./CommentCard";
export default function RecursiveComment({ comment, removeCardFromUI, switchToReplying, switchToEditing }) {
  return (
    <>
      <ListItem disablePadding={true}>
        <CommentCard  comment={comment} removeCardFromUI={removeCardFromUI} switchToEditing={switchToEditing} switchToReplying={switchToReplying} />
      </ListItem>

      {comment.replies.length > 0 && comment.replies.map(reply => (
        <div style={{ marginLeft: '20px' }} key={reply._id}>
          <RecursiveComment comment={reply} removeCardFromUI={removeCardFromUI} switchToReplying={switchToReplying} switchToEditing={switchToEditing} />
        </div>
      ))}
    </>
  );
}