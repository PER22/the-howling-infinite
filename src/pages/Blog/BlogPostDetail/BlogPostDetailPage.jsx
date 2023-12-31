import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useLoggedInUser } from '../../../components/LoggedInUserContext/LoggedInUserContext';
import "./BlogPostDetailPage.css"
import { getBlogPostById, starPostById, unstarPostById } from '../../../utilities/blog-service';
import FeedbackMessage from '../../../components/FeedbackMessage/FeedbackMessage';


const greyStarIcon = require('../../../assets/greystar.png')
const starIcon = require('../../../assets/star.png')

export default function BlogPostDetailPage() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    if (post) { setTitle(post.title); }
  }, [setTitle, post]);


  const handleStarPost = async (postId) => {
    if (!loggedInUser?.isVerified) { return; }
    try {
      const starredPost = await starPostById(postId);
      if (!starredPost.error) {
        setPost(prevPost => ({
          ...prevPost,
          stars: starredPost.data.stars,
          numStars: starredPost.data.numStars
        }));
      }
      else { setError(starredPost.error); }
    } catch (err) {
      console.log(err);
      setError("Error starring post.");
    }
  };

  const handleUnstarPost = async (postId) => {
    if (!loggedInUser?.isVerified) { return; }
    try {
      const unstarredPost = await unstarPostById(postId);
      if (!unstarredPost.error) {
        setPost(prevPost => ({
          ...prevPost,
          stars: unstarredPost.data.stars,
          numStars: unstarredPost.data.numStars
        }));
      } else {
        setError(unstarredPost.error);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const [projectIsStarred, setPostIsStarred] = useState(loggedInUser?._id && post && post.stars?.includes(loggedInUser?._id));
  const [numStars, setNumStars] = useState(post && post.numStars);


  useEffect(() => {
    setPostIsStarred(loggedInUser?._id && post && post.stars.includes(loggedInUser?._id));
  }, [post, loggedInUser?._id]);

  useEffect(() => {
    setNumStars(post && post.numStars);
  }, [post]);


  //fetch the blog post to display
  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          const tempPost = await getBlogPostById(postId);
          if (!tempPost.error) {
            setPost(tempPost.data);
          }
          else {
            setPost(null)
            setError(tempPost.error);
          }
          setLoading(false);
        }
      } catch (error) {
        setError(error)
      }
    };

    fetchPost();
  }, [postId]);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  return (
    <>

      {loggedInUser?.isAdmin && <>{loggedInUser?._id === post?.author._id ? <Link className="button" to={`/blog/${postId}/edit`}>Edit Post</Link> : ""}</>}
      {post &&
        <>
          <div dangerouslySetInnerHTML={{ __html: post.bodyText }} />
          <div className="star-info">
            {loggedInUser && <img
              src={!projectIsStarred ? greyStarIcon : starIcon}
              className="star-icon"
              alt="Star"
              onClick={!projectIsStarred ? () => handleStarPost(post._id) : () => handleUnstarPost(post._id)}
            />}
            <span className="num-stars">{numStars} star{numStars !== 1 ? "s" : ""}</span>
          </div>
          <FeedbackMessage error={error} message={message}/>
        </>}
    </>
  );
}
