import './CommentDisplaySection.css'
import CommentCard from './CommentCard';

export default function CommentDisplaySection({ comments }) {


  return (
    <div className="comment-section">
      {comments && comments.length > 0 ?
        (comments.map((comment, index) => {
          return <CommentCard key={index} comment={comment} />
        }))
        : (
          <p>No comments yet!</p>
        )
      }
    </div>
  );
}