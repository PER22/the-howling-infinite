import { Card, CardContent, Typography, IconButton, Icon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { approveCommentById, deleteCommentById } from '../../utilities/comments-service';

export default function CommentModerationCard({ comment, onCommentRemoved }) {
    
    const handleApproval = async () => {
        try {
            const approvedComment = await approveCommentById(comment._id);
            if (!approvedComment.error) {
                onCommentRemoved(comment._id);
            }
        } catch (err) {
            console.error("Error approving comment:", err);
        }
    };

    const handleDelete = async () => {
        try {
            const deletedComment = await deleteCommentById(comment._id);
            if (!deletedComment.error) {
                onCommentRemoved(comment._id);
            }
        } catch (err) {
            console.error("Error deleting comment:", err);
        }
    };

    return (
        <Card className='comment-moderation-card' sx={{marginTop: '1rem'}}>
            <CardContent sx={{display: "flex", flexDirection: 'row', alignItems: 'center'}}>
                <Typography variant="body1" sx={{flexGrow: 1}}>
                    {comment.text}
                </Typography>
                <span>
                    <IconButton onClick={handleApproval} color="primary">
                        <CheckCircleIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete} color="error">
                        <CancelIcon />
                    </IconButton>
                </span>
            </CardContent>
        </Card>
    );
}
