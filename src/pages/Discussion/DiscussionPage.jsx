import { useEffect, useState, useContext } from "react";
import { TitleContext } from '../../components/TitleBar/TitleContext'
import { getComments } from '../../utilities/comments-service'
import CommentDisplaySection from "../../components/CommentSection/CommentDisplaySection";
import AddCommentForm from "../../components/CommentSection/AddCommentForm";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";

export default function DiscussionPage() {

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle("Discussion");
    }, [setTitle]);


    const {loggedInUser, setLoggedInUser} = useLoggedInUser();
    const [parentCommentId, setParentCommentId] = useState(null);

    const [comments, setComments] = useState([]);
    
      
    useEffect(() => {
        async function fetchComments() {
            const response = await getComments();
            if (!response.error) {
                setComments(response.data);
            }
        };
        fetchComments();
    }, []);

    function addCommentToList(comment){
        const updatedComments = [...comments, comment];
        setComments(updatedComments);
    }



    
    return (
        <>
            <CommentDisplaySection comments={comments} setComments={setComments} setParentCommentId={setParentCommentId}/>

            {loggedInUser ? <AddCommentForm parentCommentId={parentCommentId} addCommentToList={addCommentToList}/> : <p>Log in to leave a comment.</p>}
        </>
    );
}                