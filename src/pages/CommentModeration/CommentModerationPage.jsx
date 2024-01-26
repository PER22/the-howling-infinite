import { useEffect, useState, useContext } from "react";
import { getCommentsAwaitingApproval } from "../../utilities/comments-service";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";
import CommentModerationCard from "../../components/Moderation/CommentModerationCard";
import UnauthorizedBanner from "../../components/UnauthorizedBanner/UnauthorizedBanner";
import FeedbackMessage from "../../components/FeedbackMessage/FeedbackMessage";
import IndeterminateLoadingSpinner from "../../components/Loading/IndeterminateLoadingSpinner";
export default function CommentModerationPage(){
    const [loading, setLoading] = useState(false);
    const { setTitle } = useContext(TitleContext);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(()=>{
        setTitle("Moderate Comments");
    },[setTitle]);
    const { loggedInUser, setLoggedInUser } = useLoggedInUser();

    const [commentsAwaitingApproval, setCommentsAwaitingApproval] = useState([]);
    useEffect(()=>{
        async function fetchCommentsAwaitingApproval(){
            setLoading(true);
            const response = await getCommentsAwaitingApproval();
            if(response && !response.error){
                setCommentsAwaitingApproval(response.data);
            }
        }
        fetchCommentsAwaitingApproval();
        setLoading(false);
    }, [])

    const handleCommentRemoved = (commentId) => {
        setLoading(true);
        setCommentsAwaitingApproval((prevComments) => {
          return prevComments.filter((comment) => comment._id !== commentId);
        });
        setTimeout(()=>setLoading(false), 250);
      };


    if(!loggedInUser || !loggedInUser?.isAdmin){return <UnauthorizedBanner/>;}
    if(!loading && commentsAwaitingApproval?.length === 0){
        return <p>No comments to moderate!</p>
    }

    return <>
        {loading && <IndeterminateLoadingSpinner/>}
        {!loading && commentsAwaitingApproval.map(
            (eachComment) => <CommentModerationCard comment={eachComment} key={eachComment._id} onCommentRemoved={handleCommentRemoved}/>
        )}
        <FeedbackMessage error={error} message={message}/>
    </>
}