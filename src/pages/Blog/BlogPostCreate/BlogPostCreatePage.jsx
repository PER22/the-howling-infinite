// /src/pages/BlogPostCreatePage.jsx:
import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate } from 'react-router-dom';
import { TextField, Button, FormControl, FormLabel } from '@mui/material';
import { createBlogPost } from '../../../utilities/blog-service';
import Editor from '../../../components/TextEditor/Editor';
import FeedbackMessage from '../../../components/FeedbackMessage/FeedbackMessage'
import 'react-quill/dist/quill.snow.css';
import './BlogPostCreate.css'

export default function NewPostForm() {
  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle('New Blog Post');
  }, [setTitle]);

  const [postTitle, setPostTitle] = useState('');
  const [bodyText, setBodyText] = useState('');
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleCreatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('bodyText', bodyText);
      if (coverPhoto) {
        formData.append('coverPhoto', coverPhoto);
      }
      const createdPost = await createBlogPost(formData);
      if (createdPost.error) {
        setError(createdPost.error);
        setMessage('');
      } else {
        setMessage(createdPost.message);
        setError('')
        setTimeout(() => { navigate(`/blog/${createdPost.data._id}`); }, 2000);
      }
    } catch (error) {
      console.log('Error creating post:', error);
    }
  };

  return (
    <>
      <form onSubmit={handleCreatePostSubmit} className='post-create-form info-card'>
      <FormControl fullWidth margin="normal">
        <TextField
          label="Title"
          value={postTitle}
          onChange={(event) => setPostTitle(event.target.value)}
          required
          sx={{backgroundColor:'white', borderRadius: '5px'}}
        />
      </FormControl>

      <FormControl fullWidth margin="normal">
      <FormLabel>Article</FormLabel>
        <Editor innerHTML={bodyText} onChange={setBodyText} />
      </FormControl>

      <FormControl fullWidth margin="normal">
        <FormLabel>Cover Photo:</FormLabel>
        <input
          type="file"
          onChange={e => setCoverPhoto(e.target.files[0])}
          style={{ display: 'none' }} // hide the default input
          id="cover-photo-input"
        />
        <label htmlFor="cover-photo-input">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        {/* {!imageError && <img src={`${getSignedURLForEssayCoverImage}`} */}
      </FormControl>

      <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
        Create Post
      </Button>
    </form>
      <FeedbackMessage error={error} message={message} />
    </>
  );
}
