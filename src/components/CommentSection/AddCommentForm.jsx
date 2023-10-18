import React, { useState } from 'react';
import {postComment} from '../../utilities/comments-api'

import './AddCommentForm.css'

function AddCommentForm({ entityType, entity, onNewComment }) {
  const [text, setText] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await postComment({
        entityType,
        entityId : entity._id,
        text
      });
      if (response && !response.error) {

        setText('');
        onNewComment(response);
      } else {
        // Handle any errors, maybe show an error message to the user.
      }
    } catch (error) {
      console.log("Failed to submit comment because: ", error)
    }
  };

  return (<>
  
    <label>Note: All comments must be approved before being displayed.</label>
      <form onSubmit={handleSubmit}  className="add-comment-form">
        
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment..."
          rows={5}
          cols={50}
        ></textarea>
        <button type="submit">Submit Comment</button>
      </form>
      </>
  );
}

export default AddCommentForm;