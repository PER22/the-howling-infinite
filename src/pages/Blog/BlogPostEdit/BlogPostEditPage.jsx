import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '../../../components/TextEditor/Editor';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import sendRequest from '../../../utilities/send-request';


export default function BlogPostEditPage({ user }) {
  const { setTitle } = useContext(TitleContext);

  //Form contents
  const { contentId } = useParams();
  const [postTitle, setPostTitle] = useState('');
  const [bodyText, setBodyText] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  //To preview cover photo if it exists
  const [previewImageURL, setPreviewImageURL] = useState('');

  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await sendRequest(`/api/content/${contentId}`);
        setPostTitle(postData.title);
        setBodyText(postData.bodyText);
        if (postData.coverPhotoS3Key) {
          const imageResponse = await sendRequest(`/api/content/image-url/${postData._id}`);
          if (imageResponse) { setPreviewImageURL(imageResponse.signedURL); }

        }
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [contentId]);

  useEffect(() => {
    setTitle(`Editing '${postTitle}'`);
  }, [setTitle, postTitle]);

  const handleUpdatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('bodyText', bodyText);
      formData.append('isMain', true);
      formData.append('type', 'blog');
      if (coverPhoto) {
        formData.append('coverPhoto', coverPhoto);
      }
      const updatedPost = await sendRequest(`/api/content/${contentId}`, "PUT", formData);
      navigate(`/blog/${updatedPost._id}`)
    } catch (error) {
      setError('Failed to update post. Please try again.');
      console.log('Error updating post:', error);
    }
  };

  const handleDeletePost = async () => {
    try {
      await sendRequest(`/api/content/${contentId}`, "DELETE");
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
      <div className="info-card">
        <form onSubmit={handleUpdatePostSubmit}>
          <label>
            Title:<br />
            <input
              type="text"
              value={postTitle}
              onChange={(event) => setPostTitle(event.target.value)}
              required
            /><br />
          </label>
          <label>
            Article:
          </label>
          {bodyText && <Editor innerHTML={bodyText} onChange={setBodyText} />}
          <div>
            <label>Cover Photo:
              <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} />
            </label>
          </div>
          {previewImageURL && <div>
            <label>Current cover photo: </label><br />
            <img src={previewImageURL} alt="Current cover img" style={{ maxWidth: '300px', maxHeight: '200px' }} />
          </div>
          }
          <button type="submit">Update Post</button><br />
        </form>
        {error && <p className="error-message">{error}</p>}
        <button className="open-delete-modal-button" onClick={openModal}>Delete Post</button>
      </div>
      {showDeleteConfirmationModal && <div className="deletion-confirmation-modal">
        <ConfirmationModal closeFunction={closeModal}
          deleteFunction={handleDeletePost}
          confirmationText={"This will permanently delete this post, and can not be undone."}
          contentId={contentId}
        />
      </div>}
    </>
  );
}
