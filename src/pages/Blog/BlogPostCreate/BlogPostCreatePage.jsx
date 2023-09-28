import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate } from 'react-router-dom';
import sendRequest from '../../../utilities/send-request';
import './BlogPostCreate.css'

export default function NewPostForm() {
  const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('New Blog Post');
    }, [setTitle]);

  const [postTitle, setPostTitle] = useState('');
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = { title: postTitle, article};
      const createdPost = await sendRequest('/api/blog', 'POST', postData);
      navigate(`/blog/${createdPost._id}`);
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
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
            <textarea rows="15" cols="35"
              value={article}
              onChange={(event) => setArticle(event.target.value)}
              required>
            </textarea>
          </label>
          <br />
          <button type="submit">Create Post</button>
        </form>
        {error && <p className="error-message">{error}</p>}
      </>
  );
}
