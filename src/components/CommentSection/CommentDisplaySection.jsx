import React from 'react';
import CommentCard from './CommentCard';
import { List, ListItem, Typography, Card, CardContent } from '@mui/material';

export default function CommentDisplaySection({ comments, setComments }) {
  const removeCardFromUI = (commentId) => {
    setComments((prevComments) => {
      return prevComments.filter((comment) => comment._id !== commentId);
    });
  };


  return (
    <List className="comment-section" disablePadding={true} sx={{marginTop:2}}>
      {comments && comments.length > 0 ? (
        comments.map((comment) => (
          <ListItem key={comment._id}disablePadding={true}>
            <CommentCard comment={comment} removeCardFromUI={removeCardFromUI}/>
          </ListItem>
        ))
      ) : (
        <Card sx={{marginTop: '1rem'}}>
        <CardContent>
            <Typography variant="body1" sx={{flexGrow: 1, textAlign:'center'}}>
                No comments yet!
            </Typography>
        </CardContent>
    </Card>
      )}
    </List>
  );
}
