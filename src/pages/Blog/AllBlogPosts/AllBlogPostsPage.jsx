// /src/pages/Blog/AllBlogPosts/AllBlogPostsPage.jsx:
import { useState, useEffect, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import { TitleContext } from "../../../components/TitleBar/TitleContext";
import { useLoggedInUser } from "../../../components/LoggedInUserContext/LoggedInUserContext";
import ContentPreviewCard from '../../../components/ContentPreviewCard/ContentPreviewCard'
import { getBlogPostPreviews } from '../../../utilities/blog-service'
import FeedbackMessage from "../../../components/FeedbackMessage/FeedbackMessage";

export default function AllBlogPostsPage() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle("Gene's Blog");
  }, [setTitle]);

  const [posts, setPosts] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchBlogPosts() {
      try {
        const retrievedPosts = await getBlogPostPreviews();
        if (retrievedPosts.data) {
          setPosts(retrievedPosts.data);
          setError(retrievedPosts.error);
        } else {
          setError(retrievedPosts.error);
        }
      } catch (err) {
        console.log("Error retrieving all blog posts.");
      }
    }
    fetchBlogPosts();
  }, []);

  return (
    <>
      <div className="navigation-container">
      {loggedInUser && loggedInUser.isAdmin && (
          <Button
            component={RouterLink}
            to="/blog/new"
            variant="contained"
            color="primary"
            className="edit-content-button"
          >
            New Blog Post
          </Button>
        )}
        
      </div>
      <div id="card-container">
        {posts && posts.map((eachPost, index) => (
          <ContentPreviewCard key={index} content={eachPost} type={'blog'} />
        ))}
      </div>
      <FeedbackMessage error={error} mesage={message}/>
    </>
  );
}