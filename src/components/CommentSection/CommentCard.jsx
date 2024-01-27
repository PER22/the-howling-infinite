import { useState } from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ReplyIcon from '@mui/icons-material/Reply';
import Chip from '@mui/material/Chip';
import PendingIcon from '@mui/icons-material/Pending';
import { deleteCommentById } from "../../utilities/comments-service";
import { useLoggedInUser } from "../LoggedInUserContext/LoggedInUserContext";
import ConfirmationDialog from './ConfirmationDialog';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

export default function CommentCard({ comment, removeCardFromUI, setParentCommentId }) {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const [openConfirmationDialog, setOpenConfirmationDialog] = useState(false);

  const handleDelete = async () => {
    try {
      handleConfirmationModalClose();
      const response = await deleteCommentById(comment._id);
      console.log(response);
      if (!response.error) {
        if(response.data.hardDelete){
          removeCardFromUI(comment._id);
        }
        
      }
    } catch (err) {
      console.log("Error deleting comment.");
    }
  };

  const handleConfirmationModalOpen = () => {
    setOpenConfirmationDialog
(true);
  };

  const handleConfirmationModalClose = () => {
    setOpenConfirmationDialog
(false);
  };


  const handleReplyClick = () => {
    setParentCommentId(comment._id);
  }

  return (<>
    <Card elevation={3} className="comment-card" sx={{ marginBottom: '1rem', width: '100%' }}>
      <CardContent sx={{ display: "flex", flexDirection: "column", gap: '0.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" className="comment-author">
            {comment.author.isAdmin && <AssignmentIndIcon/>}{comment.author.name}
          </Typography>
          {!comment.isApproved && loggedInUser?._id === comment.author._id && (
            <Chip
              icon={<PendingIcon />}
              label="Awaiting Approval"
              size="small"
              color="warning"
              variant="outlined"
            />
          )}
        </div>
        <Typography variant="body2" className="comment-text">
          {comment.text}
        </Typography>
        <Typography variant="caption" className="comment-timestamp">
          {new Date(comment.createdAt).toLocaleString()}
        </Typography>
        {loggedInUser &&
          <IconButton size="small" onClick={handleReplyClick} sx={{ alignSelf: 'flex-end' }}>
            <ReplyIcon />
          </IconButton>
        }
        {((loggedInUser?._id === (comment.author._id || comment.author)) || (loggedInUser?.isAdmin)) &&
          <IconButton size="small" onClick={handleConfirmationModalOpen} sx={{ alignSelf: 'flex-end' }}>
            <DeleteIcon fontSize="inherit" />
          </IconButton>
        }
      </CardContent>
    </Card>

    {openConfirmationDialog && 
    <ConfirmationDialog
      open={openConfirmationDialog}
      onClose={() => setOpenConfirmationDialog
    (false)}
      onConfirm={handleDelete}
      title="Confirm Delete"
      message="Are you sure you want to delete this comment?"
    />}
  </>
  );
}
