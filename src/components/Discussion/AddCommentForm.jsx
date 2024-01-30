import React, { useState } from 'react';
import { postComment } from '../../utilities/comments-api';
import { Button, TextField, Typography, Box, FormControl, IconButton } from '@mui/material';
import { Cancel } from '@mui/icons-material';

function AddCommentForm({ parentComment, addCommentToList, setParentComment, textInputRef, commentToBeEdited, setCommentToBeEdited }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let parentCommentId = null;
      if (parentComment) {
        parentCommentId = parentComment._id;

      }
      const response = await postComment({
        text,
        parentCommentId
      });

      if (response && !response.error) {
        setText('');
        addCommentToList(response.data)
      } else {
        // Handle any errors, maybe show an error message to the user.
      }
    } catch (error) {
      console.log("Failed to submit comment because: ", error);
    }
  };

  return (
    <Box component="div" sx={{ width: '100%', mb: 3 }}>
      <Typography variant="body1">
        Note: All comments must be approved before being displayed.
      </Typography>
      {parentComment && <>
        <p>Replying to: '{parentComment.text}'</p>
        <IconButton onClick={() => { 
          setParentComment(null); 
          setText(""); 
          }}>
          <Cancel />
        </IconButton>
      </>
      }
      {commentToBeEdited && <>
        <p>Editing: '{commentToBeEdited.text}'</p>
        <IconButton onClick={() =>{ 
          setCommentToBeEdited(null);
          setText("");
          }}>
          <Cancel />
        </IconButton>
      </>
      }
      <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
        <TextField
          value={commentToBeEdited ? commentToBeEdited.text : text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          multiline
          rows={5}
          variant="outlined"
          fullWidth
          sx={{ backgroundColor: "white", borderRadius: '4px' }}
          inputRef={textInputRef}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit Comment
        </Button>
      </FormControl>
    </Box>
  );
}

export default AddCommentForm;
