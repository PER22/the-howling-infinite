import { approveCommentById, deleteCommentById } from '../../utilities/comments-service'
export default function CommentModerationCard({ comment }) {
    console.log("comment in card: ", comment);
    const handleApproval = () => {
        async function approveComment() {
            try {
                const approvedComment = await approveCommentById(comment._id);
                if (!approvedComment.error) {
                    //Todo: remove from list?
                }
            } catch (err) { }
        }
        approveComment();
    };
    const handleDelete = () => {
        async function deleteComment() {
            try {
                const deletedComment = await deleteCommentById(comment._id);
                if (!deletedComment.error) {
                    //Todo: remove from list?
                }
            } catch (err) { }
        }
        deleteComment();
     };

    return (

        <div>
            <p>{comment.text}</p>
            <span onClick={handleApproval}>Approve </span>
            <span onClick={handleDelete}>Delete</span>
        </div>
    );
}