import { useEffect, useState, useContext } from "react";
import { getCommentsAwaitingApproval } from "../../utilities/comments-service";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";
import CommentModerationCard from "../../components/CommentSection/CommentModerationCard";
import UnauthorizedBanner from "../../components/UnauthorizedBanner/UnauthorizedBanner";
export default function CommentModerationPage(){
    const { setTitle } = useContext(TitleContext);
    useEffect(()=>{
        setTitle("Moderate Comments");
    },[setTitle]);
    const { loggedInUser, setLoggedInUser } = useLoggedInUser();

    const [commentsAwaitingApproval, setCommentsAwaitingApproval] = useState([]);
    useEffect(()=>{
        async function fetchCommentsAwaitingApproval(){
            const response = await getCommentsAwaitingApproval();
            if(response && !response.error){
                setCommentsAwaitingApproval(response.data);
            }
        }
        fetchCommentsAwaitingApproval();
    }, [])

    const handleCommentRemoved = (commentId) => {
        setCommentsAwaitingApproval((prevComments) => {
          return prevComments.filter((comment) => comment._id !== commentId);
        });
      };


    if(!loggedInUser || !loggedInUser?.isAdmin){return <UnauthorizedBanner/>;}
    if(commentsAwaitingApproval?.length === 0){
        return <p>No comments to moderate!</p>
    }
    return <>
        {commentsAwaitingApproval.map(
            (eachComment) => <CommentModerationCard comment={eachComment} key={eachComment._id} onCommentRemoved={handleCommentRemoved}/>
        )}
    </>
}