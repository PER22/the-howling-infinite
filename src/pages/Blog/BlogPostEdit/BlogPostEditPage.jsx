import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useNavigate, useParams } from 'react-router-dom';
import Editor from '../../../components/TextEditor/Editor';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import FeedbackMessage from '../../../components/FeedbackMessage/FeedbackMessage';
import { editBlogPost, getBlogPostById } from '../../../utilities/blog-service';
import { getSignedURLForImage } from '../../../utilities/images-service';
import sendRequest from '../../../utilities/send-request';
import UnauthorizedBanner from '../../../components/UnauthorizedBanner/UnauthorizedBanner';


export default function BlogPostEditPage({ loggedInUser }) {
  const { setTitle } = useContext(TitleContext);

  //Form contents
  const {postId } = useParams();
  const [postTitle, setPostTitle] = useState('');
  const [bodyText, setBodyText] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);
  //To preview cover photo if it exists
  const [previewImageURL, setPreviewImageURL] = useState('');

  const [error, setError] = useState('');
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getBlogPostById(postId);
        if(!post.error){
          setPostTitle(post.data.title);
          setBodyText(post.data.bodyText);
          if (post.data.coverPhotoS3Key) {
            const imageResponse = await getSignedURLForImage(post.data.coverPhotoS3Key);
            if (imageResponse) { setPreviewImageURL(imageResponse.data.signedURL); }
          }
        }
        
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [postId]);

  useEffect(() => {
    setTitle(`Editing '${postTitle}'`);
  }, [setTitle, postTitle]);

  const handleUpdatePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData();
      formData.append('title', postTitle);
      formData.append('bodyText', bodyText);
      if (coverPhoto) {
        formData.append('coverPhoto', coverPhoto);
      }
      const updatedPost = await editBlogPost(postId, formData);
      if (!updatedPost.error){
        navigate(`/blog/${postId}`)
      }else{
        setError(updatedPost.error)
      }
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

  if(!loggedInUser || !loggedInUser.isAdmin){
    return <UnauthorizedBanner/>
  }
  return (
    <>
      <div className="info-card">
        <form onSubmit={handleUpdatePostSubmit}>
          <label>
            Title:<br />
            <input
              type="text"
              name={"postTitleInput"}
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
              <input type="file" name={"coverPhotoInput"} onChange={e => setCoverPhoto(e.target.files[0])} />
            </label>
          </div>
          {previewImageURL && <div>
            <label>Current cover photo: </label><br />
            <img src={previewImageURL} alt="Current cover img" style={{ maxWidth: '300px', maxHeight: '200px' }} />
          </div>
          }
          <button type="submit">Update Post</button><br />
        </form>
        <FeedbackMessage error={error} message={message}/>
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
