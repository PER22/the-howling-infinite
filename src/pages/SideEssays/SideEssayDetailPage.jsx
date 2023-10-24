import { useState, useEffect, useContext } from "react";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useParams, Link } from "react-router-dom";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";
import AddCommentForm from '../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../components/CommentSection/CommentDisplaySection';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';
import { getCommentsOn } from "../../utilities/comments-service";
import { getSideEssay, starEssayById, unstarEssayById } from "../../utilities/essays-service";
const greyStarIcon = require("../../assets/greystar.png");
const starIcon = require('../../assets/star.png');

export default function SideEssayDetailPage() {
  const [sideEssay, setSideEssay] = useState(null);
  const { essayId } = useParams();
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();

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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [essayIsStarred, setEssayIsStarred] = useState(loggedInUser?._id && sideEssay && sideEssay?.stars?.includes(loggedInUser?._id));
  const [numStars, setNumStars] = useState(sideEssay && sideEssay.numStars);

  const handleStarEssay = async (sideEssay) => {
    if (!loggedInUser?.isVerified) { return; }
    try {
      const response = await starEssayById(sideEssay);
      if (!response.error) {
        setSideEssay(prevEssay => ({
          ...prevEssay,
          stars: response.data.stars,
          numStars: response.data.numStars
        }));
        setError(null);
      }
      else { setError(response.error); }
    } catch (err) {
      console.log(err);
      setError("Error starring post.");
    }
  };

  const handleUnstarEssay = async (mainEssay) => {
    if (!loggedInUser?.isVerified) { return; }
    try {
      const response = await unstarEssayById(mainEssay);
      if (!response.error) {
        setSideEssay(prevEssay => ({
          ...prevEssay,
          stars: response.data.stars,
          numStars: response.data.numStars
        }));
        setError(null);
      } else {
        setError(response.error);
      }
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    setEssayIsStarred(loggedInUser?._id && sideEssay && sideEssay?.stars?.includes(loggedInUser?._id));
  }, [sideEssay, loggedInUser?._id]);

  useEffect(() => {
    setNumStars(sideEssay && sideEssay.numStars);
  }, [sideEssay]);


  return (
    <>{sideEssay && (
      <>
        <div className="navigation-container">
          {loggedInUser && loggedInUser.isAdmin && <Link to={`/side-essays/${sideEssay._id}/edit`} className="edit-content-button">Edit This Essay</Link>}

        </div>
        <div dangerouslySetInnerHTML={{ __html: sideEssay.bodyHTML }} />
        <div className="star-info">
          {loggedInUser && <img
            src={!essayIsStarred ? greyStarIcon : starIcon}
            className="star-icon"
            alt="Star"
            onClick={!essayIsStarred ? () => handleStarEssay(sideEssay._id) : () => handleUnstarEssay(sideEssay._id)}
          />}
          <span className="num-stars">{numStars} star{numStars === 1 ? "" : "s"}</span>
        </div>
        <CommentDisplaySection comments={comments} setComments={setComments} />
        {loggedInUser ? <AddCommentForm entity={sideEssay} entityType='Essay'/> : <p>Log in to leave a comment.</p>}
        <FeedbackMessage error={error} message={message} />
      </>)}
    </>
  );
}