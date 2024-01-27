import { useState } from 'react';
import moment from 'moment';
import { Card, CardContent, Typography, IconButton, Icon } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { approveCommentById, deleteCommentById } from '../../utilities/comments-service';
import ConfirmationDialog from '../CommentSection/ConfirmationDialog';

export default function CommentModerationCard({ comment, onCommentRemoved }) {
    const [displayConfirmationModal, setDisplayConfirmationModal] = useState(false);
    const [dateUpdated, ...timeUpdated] = moment(comment.updatedAt).format('MM/DD/YYYY hh:mm a').split(' ');
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

    return (<>
        <Card className='comment-moderation-card' sx={{ marginTop: '1rem' }}>
            <CardContent sx={{ display: "flex", flexDirection: 'row', alignItems: 'center' }}>
                <div className={"comment-information"}>
                    <Typography variant="h3">
                        {comment.author.name}
                    </Typography>
                    <Typography variant="body2">
                        Updated at {timeUpdated} on {dateUpdated}.
                    </Typography>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        {comment.text}
                    </Typography>
                </div>
                <div>
                    <IconButton onClick={handleApproval} color="primary">
                        <CheckCircleIcon />
                    </IconButton>
                    <IconButton onClick={() => setDisplayConfirmationModal(true)} color="error">
                        <CancelIcon />
                    </IconButton>
                </div>
            </CardContent>
        </Card>

        {displayConfirmationModal && <ConfirmationDialog
            open={() => setDisplayConfirmationModal(true)}
            onClose={() => setDisplayConfirmationModal(false)}
            onConfirm={handleDelete}
            title="Confirm Delete"
            message="Are you sure you want to delete this comment?"
        />}
    </>);
}
