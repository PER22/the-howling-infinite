import { useEffect, useState, useContext } from "react";
import { getCommentsAwaitingApproval } from "../../utilities/comments-service";
import { TitleContext } from "../../components/TitleBar/TitleContext";
import CommentModerationCard from "../../components/CommentModerationCard/CommentModerationCard";
import UnauthorizedBanner from "../../components/UnauthorizedBanner/UnauthorizedBanner";
export default function CommentModerationPage({loggedInUser}){
    const { setTitle } = useContext(TitleContext);
    useEffect(()=>{
        setTitle("Moderate Comments");
    },[setTitle]);

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

    if(!loggedInUser && loggedInUser?.isAdmin){return <UnauthorizedBanner/>;}
    if(commentsAwaitingApproval?.length === 0){
        return <p>No comments to moderate!</p>
    }
    return <>
        {commentsAwaitingApproval.map(
            (eachComment) => <CommentModerationCard comment={eachComment} key={eachComment._id}/>
        )}
    </>
}