import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TitleBar from '../../../components/TitleBar/TitleBar';
import sendRequest from '../../../utilities/send-request';
import './BlogPostCreate.css'
export default function NewPostForm() {
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = { title, article};
      const createdPost = await sendRequest('/api/blog', 'POST', postData);
      navigate(`/blog/${createdPost._id}`);
    } catch (error) {
      setError('Failed to create post. Please try again.');
      console.error('Error creating post:', error);
    }
  };

  return (
      <>
        <TitleBar title={"New Blog Post"}></TitleBar>
        <form onSubmit={handleCreatePostSubmit} className='post-create-form info-card'>
          <label>
            Title:
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
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
