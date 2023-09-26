import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById } from '../../../utilities/posts-api';
import { Link } from 'react-router-dom';
import BlogPostCard from '../../../components/BlogPostCard/BlogPostCard';
import TitleBar from '../../../components/TitleBar/TitleBar';
import "./BlogPostDetailPage.css"

export default function BlogPostDetailPage({loggedInUser}) {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <TitleBar title={post.title}></TitleBar>
      {loggedInUser && <>{loggedInUser._id === post.author._id? <Link className="button" to={`/blog/${postId}/edit`}>Edit Post</Link>: ""}</>}
      <BlogPostCard post={post} loggedInUser={loggedInUser} setPost={setPost}/>
    </>
  );
}
