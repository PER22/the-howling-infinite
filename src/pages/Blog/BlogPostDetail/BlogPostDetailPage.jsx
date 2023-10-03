import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../../components/TitleBar/TitleContext';
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import sendRequest from '../../../utilities/send-request';
import "./BlogPostDetailPage.css"

export default function BlogPostDetailPage({loggedInUser}) {

  const { contentId } = useParams();
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
        parentId: contentId,
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
        console.log("fetching Post");
        const tempPost = await sendRequest(`/api/content/${contentId}`);
        setPost(tempPost);
        setLoading(false);
        
      } catch (error) {
      }
    };

    fetchPost();
  }, [contentId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!post) {
    return <p>Post not found.</p>;
  }


  return (
    <>
      {loggedInUser && <>{loggedInUser._id === post.author._id? <Link className="button" to={`/blog/${contentId}/edit`}>Edit Post</Link>: ""}</>}
      {post &&
            <>
            <div dangerouslySetInnerHTML={{__html: post.bodyText}}/>
            </>}
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
