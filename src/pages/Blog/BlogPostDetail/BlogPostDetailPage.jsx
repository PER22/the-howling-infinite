import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import sendRequest from '../../../utilities/send-request';
import AddCommentForm from '../../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../../components/CommentSection/CommentDisplaySection';
import "./BlogPostDetailPage.css"

export default function BlogPostDetailPage({ loggedInUser }) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    if (post) { setTitle(post.title); }
  }, [setTitle, post]);

  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (postId) {
          const tempPost = await sendRequest(`/api/blog/${postId}`);
          if (tempPost) { 
            setPost(tempPost);
          }
          setLoading(false);
        }
      } catch (error) {
      }
    };

    fetchPost();
  }, [postId]);

  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        if (postId) {
          const tempComments = await sendRequest(`/api/comments/on/Blog/${postId}`);
          if (tempComments) { 
            setComments(tempComments);
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

      {loggedInUser && <>{loggedInUser._id === post.author._id ? <Link className="button" to={`/blog/${postId}/edit`}>Edit Post</Link> : ""}</>}
      {post &&
        <>
          <div dangerouslySetInnerHTML={{ __html: post.bodyText }} />
          <CommentDisplaySection comments={comments}/>
          <AddCommentForm entity={post} entityType='Blog' onNewComment={handleNewComment}/>
        </>}
    </>
  );
}
