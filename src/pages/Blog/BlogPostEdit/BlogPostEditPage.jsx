import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../../components/LoggedInUserContext/LoggedInUserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { TextField, Button, FormControl, FormLabel} from '@mui/material';
import Editor from '../../../components/TextEditor/Editor';
import ConfirmationModal from '../../../components/ConfirmationModal/ConfirmationModal';
import FeedbackMessage from '../../../components/FeedbackMessage/FeedbackMessage';
import { editBlogPost, getBlogPostById, deleteBlogPostById } from '../../../utilities/blog-service';
import UnauthorizedBanner from '../../../components/UnauthorizedBanner/UnauthorizedBanner';


export default function BlogPostEditPage() {
  const { setTitle } = useContext(TitleContext);
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();

  //Form contents
  const {postId } = useParams();
  const [postTitle, setPostTitle] = useState('');
  const [bodyText, setBodyText] = useState(null);
  const [coverPhoto, setCoverPhoto] = useState(null);

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
      const response = await deleteBlogPostById(postId);
      if(!response.error){
        navigate(`/blog`);
      }else{
        setError(response.error);
      }
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
    <FormControl fullWidth margin="normal">
      <TextField
        label="Title"
        name="postTitleInput"
        value={postTitle}
        onChange={(event) => setPostTitle(event.target.value)}
        sx={{backgroundColor: 'white', borderRadius: '5px'}}
        required
      />
    </FormControl>

    <FormControl fullWidth margin="normal">
      <FormLabel>Article</FormLabel>
      {bodyText && <Editor innerHTML={bodyText} onChange={setBodyText} />}
    </FormControl>

    <FormControl fullWidth margin="normal">
      <FormLabel>Cover Photo:</FormLabel>
      <input
        type="file"
        name="coverPhotoInput"
        onChange={e => setCoverPhoto(e.target.files[0])}
        style={{ display: 'none' }}
        id="cover-photo-update-input"
      />
      <label htmlFor="cover-photo-update-input">
        <Button variant="contained" color="primary" component="span">
          Upload
        </Button>
      </label>
    </FormControl>

    <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
      Update Post
    </Button>
  </form>
        <FeedbackMessage error={error} message={message}/>
        <Button variant="contained" color="warning" onClick={openModal} sx={{marginTop: "3rem"}}>
                        Delete
                    </Button>
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
