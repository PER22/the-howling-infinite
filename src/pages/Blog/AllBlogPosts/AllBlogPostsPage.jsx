import { useState, useEffect, useContext } from "react";
import { TitleContext } from "../../../components/TitleBar/TitleContext";
import ContentPreviewCard from '../../../components/ContentPreviewCard/ContentPreviewCard'
import sendRequest from "../../../utilities/send-request";

export default function AllBlogPostsPage(){
  const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle("Gene's Blog");
    }, [setTitle]);
    
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
      <div id="card-container">
        {posts && posts.map((eachPost, index) => (
          <ContentPreviewCard key={index} content={eachPost} type={'blog'}/>
        ))}
      </div>
      {error && <p>{error}</p>}
    </>
  );
}