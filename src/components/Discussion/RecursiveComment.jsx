import { ListItem } from "@mui/material";
import CommentCard from "./CommentCard";
export default function RecursiveComment({ comment, removeCardFromUI, setParentComment, focusOnTextInput}) {
    return (
      <div>
        <ListItem disablePadding={true}>
          <CommentCard comment={comment} removeCardFromUI={removeCardFromUI} setParentComment={setParentComment} focusOnTextInput={focusOnTextInput}/>
        </ListItem>
  
        {comment.replies.length > 0 && comment.replies.map(reply => (
          <div style={{ marginLeft: '20px' }} key={reply._id}>
            <RecursiveComment comment={reply} removeCardFromUI={removeCardFromUI} setParentComment={setParentComment} focusOnTextInput={focusOnTextInput}/>
          </div>
        ))}
      </div>
    );
  }