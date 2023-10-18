// /src/pages/BlogPostCreatePage.jsx:
import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate } from 'react-router-dom';
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
        <label>
          Title:
          <input
            type="text"
            value={postTitle}
            onChange={(event) => setPostTitle(event.target.value)}
            required
          />
        </label>
        <br />
        <label>
          Article:<br />
          <Editor innerHTML={bodyText} onChange={setBodyText} />
        </label>
        <div>
          <label>Cover Photo:</label>
          <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} />
          {/* {!imageError $$ <img src=`${getSignedURLForEssayCoverImage}`} */}
        </div>
        <br />
        <button type="submit">Create Post</button>
      </form>
      <FeedbackMessage error={error} message={message} />
    </>
  );
}
