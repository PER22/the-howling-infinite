import { useState, useEffect, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useParams, Link } from "react-router-dom";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";
import AddCommentForm from '../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../components/CommentSection/CommentDisplaySection';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';
import { getCommentsOn } from "../../utilities/comments-service";
import { getSideEssay } from "../../utilities/essays-service";

export default function SideEssayDetailPage() {
  const [sideEssay, setSideEssay] = useState(null);
  const { essayId } = useParams();

  useEffect(() => {
    async function fetchSideEssay() {
      try {
        const response = await getSideEssay(essayId);
        if (!response.error) {
          setSideEssay(response.data);
        }
      } catch (err) {
        console.log("Error fetching side essay: ", err);
      }
    }
    fetchSideEssay();
  }
    , [essayId]);

  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    if (sideEssay) setTitle(sideEssay.title);
  }, [setTitle, sideEssay]);

  const [comments, setComments] = useState([]);
  useEffect(() => {
    const fetchPostComments = async () => {
      try {
        if (sideEssay) {
          const tempComments = await getCommentsOn("Essay", sideEssay._id);
          console.log(tempComments);
          if (!tempComments.error) {
            if (Array.isArray(tempComments.data)) {
              setComments(tempComments.data);
            } else {
              console.log('API did not return an array for comments:', tempComments);
            }
          }
        }
      } catch (error) {
      }
    };
    fetchPostComments();
  }, [sideEssay]);

  const handleNewComment = (newComment) => {
    setComments(prevComments => [...prevComments, newComment]);
  };

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  return (
    <>{sideEssay && (
      <>
        <div className="navigation-container">
        {loggedInUser && loggedInUser.isAdmin && <Link to={`/side-essays/${sideEssay._id}/edit`} className="edit-content-button">Edit This Essay</Link>}
          
        </div>
        <div dangerouslySetInnerHTML={{ __html: sideEssay.bodyHTML }} />
        <CommentDisplaySection comments={comments} setComments={setComments}/>
        {loggedInUser ? <AddCommentForm entity={sideEssay} entityType='Essay' onNewComment={handleNewComment} />: <p>Log in to leave a comment.</p>}
        <FeedbackMessage error={error} message={message}/>
      </>)}
    </>
  );
}