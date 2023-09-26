import { useState, useEffect } from "react";
import BlogPostPreviewCard from "../../../components/BlogPostPreviewCard/BlogPostPreviewCard";
import TitleBar from "../../../components/TitleBar/TitleBar";
import sendRequest from "../../../utilities/send-request";
export default function AllBlogPostsPage(){
    
  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");

  useEffect( () => {
    async function fetchBlogPosts(){
    try{
      const retrievedPosts = await sendRequest('/api/blog');
      if(retrievedPosts){
        setPosts(retrievedPosts);
        setError(null);
      }else{
        setError("Failed to retrieve blog posts.");
      }
    }catch(err){
      console.log("Error retrieving all blog posts.");
    }
  }
  fetchBlogPosts();
  }, []);

  return (
    <>
      <TitleBar title={"Gene's Blog"}></TitleBar>
      {posts && posts.map((eachPost) => (
        <BlogPostPreviewCard key={eachPost._id} post={eachPost}/>
      ))}
      {error && <p>{error}</p>}
    </>
  );






}