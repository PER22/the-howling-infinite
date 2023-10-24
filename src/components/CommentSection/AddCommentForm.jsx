import React, { useState } from 'react';
import { postComment } from '../../utilities/comments-api';
import { Button, TextField, Typography, Box, FormControl } from '@mui/material';

function AddCommentForm({ entityType, entity }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postComment({
        entityType,
        entityId: entity._id,
        text
      });
      if (response && !response.error) {
        setText('');
        //display modal
      } else {
        // Handle any errors, maybe show an error message to the user.
      }
    } catch (error) {
      console.log("Failed to submit comment because: ", error);
    }
  };

  return (
    <Box component="div" sx={{ width: '100%', mb:3}}>
      <Typography variant="body1">
        Note: All comments must be approved before being displayed.
      </Typography>

      <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '100%' }}>
        <TextField
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          multiline
          rows={5}
          variant="outlined"
          fullWidth
          sx={{backgroundColor: "white", borderRadius:'4px'}}
        />
        <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
          Submit Comment
        </Button>
      </FormControl>
    </Box>
  );
}

export default AddCommentForm;
