export default function CommentCard({comment}){
    return (
        <div className="comment-card">
          <div className="comment-author">{comment.author.name}</div>
          <div className="comment-text">{comment.text}</div>
          <div className="comment-timestamp">{new Date(comment.createdAt).toLocaleString()}</div>
        </div>
      );
}