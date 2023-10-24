import { useEffect, useState, useContext } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Button } from "@mui/material";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";
import ContentPreviewCard from "../../components/ContentPreviewCard/ContentPreviewCard";
import { getSideEssayPreviews } from "../../utilities/essays-service";
import FeedbackMessage from "../../components/FeedbackMessage/FeedbackMessage";

export default function SideEssaysIndexPage() {
  const { loggedInUser, setLoggedInUser } = useLoggedInUser();
  const [sideEssays, setSideEssays] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  useEffect(() => {
    async function fetchSideEssays() {
      try {
        const recievedSideEssays = await getSideEssayPreviews();
        if (!recievedSideEssays.error) {
          setSideEssays(recievedSideEssays.data);
          setError(null);
          setMessage(null);
        } else {
          setError(recievedSideEssays.error);
        }
      } catch (err) {
        console.log("Error fetching side essays: ", err);
      }
    }
    fetchSideEssays();
  }, []);

  const { setTitle } = useContext(TitleContext);
  useEffect(() => {
    setTitle('Side Essays');
  }, [setTitle]);

  return (<>
    <>
      <div className="navigation-container">
        {loggedInUser && loggedInUser.isAdmin && (
          <Button
            component={RouterLink}
            to="/side-essays/new"
            variant="contained"
            color="primary"
            className="edit-content-button"
          >
            Create New Essay
          </Button>
        )}
      </div>
      <section id="card-container">
        {(sideEssays.length > 0) && sideEssays.map(essay => (
          <ContentPreviewCard key={essay._id} content={essay} type={"essay"} />
        ))}
      </section>
      <FeedbackMessage error={error} message={message} />
    </>
  </>);
}