import React, { useState, useEffect } from 'react';
import { postComment } from '../../utilities/comments-service';
import { Button, TextField, Typography, Box, FormControl, IconButton } from '@mui/material';
import { Cancel } from '@mui/icons-material';
import { editCommentById } from '../../utilities/comments-service';

function AddCommentForm({ parentComment, addCommentToList, textInputRef, commentToBeEdited, cancelReply, cancelEdit }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (commentToBeEdited) {
      setText(commentToBeEdited.text);
    }
  }, [commentToBeEdited]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (commentToBeEdited) {
        const response = await editCommentById(commentToBeEdited._id, {newText: text});
        if (response && !response.error) {
          setText('');
          // updateCommentInList(response.data) TODO: I am currently ok with reloading the page but in the near future this needs to be responsive
        } else {
          // Handle any errors, maybe show an error message to the user.
        }
      } else {
        let parentCommentId = null;
        //handles the cases where it's a reply
        if (parentComment) {
          parentCommentId = parentComment._id;
        }
        //handles the case where it's a parent comment
        const response = await postComment({ //TODO, was accidentally using comments-api not comments-service
          text,
          parentCommentId
        });
        if (response && !response.error) {
          setText('');
          addCommentToList(response.data)
        } else {
          // Handle any errors, maybe show an error message to the user.
        }
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
          cancelReply();
          setText("");
        }}>
          <Cancel />
        </IconButton>
      </>
      }
      {commentToBeEdited && <>
        <p>Editing: '{commentToBeEdited.text}'</p>
        <IconButton onClick={() => {
          cancelEdit();
          setText("");
        }}>
          <Cancel />
        </IconButton>
      </>
      }
      <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
        <TextField
          value={text}
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
