import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AddCommentForm from '../../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../../components/CommentSection/CommentDisplaySection';
import "./BlogPostDetailPage.css"
import { getCommentsOn } from '../../../utilities/comments-api'; //TODO: this should be routed through the service.
import { getBlogPostById, unstarPostById } from '../../../utilities/blog-service';
import { starPostById } from '../../../utilities/blog-service';

const greyStarIcon = require('../../../assets/greystar.png')
const starIcon = require('../../../assets/star.png')

export default function BlogPostDetailPage({ loggedInUser }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const { setTitle } = useContext(TitleContext);

  useEffect(() => {
    if (post) { setTitle(post.title); }
  }, [setTitle, post]);

  
  const handleStarPost = async (postId) => {
    if (!loggedInUser?.isVerified) { return; }
    try {
      const starredPost = await starPostById(postId);
      if(!starredPost.error){setPost(starredPost.data);}
      else{setError(starredPost.error);}
    } catch (err) {
      console.log(err);
      setError("Error starring post.");
    }
  };

  const handleUnstarPost = async (postId) => {
    if (!loggedInUser?.isVerified) { return; }
    try {
      const updatedPost = await unstarPostById(postId);
      if(!updatedPost.error){
        setPost(updatedPost.data);
        setError(null);
      }else{
        setError(updatedPost.error);
      }
      setPost(updatedPost);
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
          console.log(tempPost.data);
          if (!tempPost.error) {
            setPost(tempPost.data);
          }
          setLoading(false);
        }
      } catch (error) {
      }
    };

    fetchPost();
  }, [postId]);

  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        if (postId) {
          const tempComments = await getCommentsOn("Blog", postId);
          if (tempComments) {
            setComments(tempComments.data);
          }
        }
      } catch (error) {
      }
    };
    fetchPostComments();
  }, [postId]);


  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }

  const handleNewComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };


  return (
    <>

      {loggedInUser && <>{loggedInUser?._id === post?.author._id ? <Link className="button" to={`/blog/${postId}/edit`}>Edit Post</Link> : ""}</>}
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
          <CommentDisplaySection comments={comments} />
          <AddCommentForm entity={post} entityType='Blog' onNewComment={handleNewComment} />
        </>}
    </>
  );
}
