import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import TitleBar from '../../../components/TitleBar/TitleBar';
import sendRequest from '../../../utilities/send-request';


export default function BlogPostEditPage({ user }) {
  const { postId } = useParams();
  const [title, setTitle] = useState('');
  const [article, setArticle] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await sendRequest(`/api/blog/${postId}`);
        setTitle(postData.title);
        setArticle(postData.article);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    fetchPost();
  }, [postId]);


  const handleUpdatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const postData = { title, article };
      const updatedPost = await sendRequest(`/api/blog/${postId}`, "PUT", postData);
      navigate(`/blog/${updatedPost._id}`)
    } catch (error) {
      setError('Failed to update post. Please try again.');
      console.log('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await sendRequest(`/api/blog/${postId}`, "DELETE");
      navigate(`/blog`);
    } catch (error) {
      console.log('Error deleting post:', error);
      setError("Deleting post failed.")
    }
  };

  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
  const closeModal = () => { setShowDeleteConfirmationModal(false) };
  const openModal = () => { setShowDeleteConfirmationModal(true) };

  return (
    <>
    <TitleBar title={`Editing '${title}'`}></TitleBar>
      <div className="info-card">
        <form onSubmit={handleUpdatePostSubmit}>
          <label>
            Title:<br />
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
            /><br />
          </label>
          <label>
            Article:
            <textarea
              value={article}
              onChange={(event) => setArticle(event.target.value)}
              required
            ></textarea><br />
          </label>
          <button type="submit">Update Post</button><br />
        </form>
        {error && <p className="error-message">{error}</p>}
        <button className="open-delete-modal-button" onClick={openModal}>Delete Post</button>
      </div>
      {showDeleteConfirmationModal && <div className="deletion-confirmation-modal">
        <ConfirmationModal closeFunction={closeModal}
          deleteFunction={handleDeletePost}
          confirmationText={"This will permanently delete this post, and can not be undone."}
          contentId={postId}
        />
      </div>}
    </>
  );
}
