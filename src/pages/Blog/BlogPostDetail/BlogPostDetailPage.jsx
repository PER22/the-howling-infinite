import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../../utilities/posts-api';
import { Link } from 'react-router-dom';
import BlogPostCard from '../../../components/BlogPostCard/BlogPostCard';
import "./BlogPostDetailPage.css"
import sendRequest from '../../../utilities/send-request';

export default function BlogPostDetailPage({loggedInUser}) {

  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
      if(post){setTitle(post.title);}
  }, [setTitle, post]);

  const [commentContent, setCommentContent] = useState('');

  const handleCommentContentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendRequest('/api/comments', "POST", {
        content: commentContent,
        parentId: postId,
        parentType: 'BlogPost'
      });
      setCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const tempPost = await getPostById(postId);
        setPost(tempPost);
        setLoading(false);
        
      } catch (error) {
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
      {loggedInUser && <>{loggedInUser._id === post.author._id? <Link className="button" to={`/blog/${postId}/edit`}>Edit Post</Link>: ""}</>}
      <BlogPostCard post={post} loggedInUser={loggedInUser} setPost={setPost}/>
      {loggedInUser && (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            value={commentContent}
            onChange={handleCommentContentChange}
            placeholder="Add a comment..."
            required
          />
          <button type="submit">Post Comment</button>
        </form>)}
    </>
  );
}
