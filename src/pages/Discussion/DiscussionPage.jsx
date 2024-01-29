import { useEffect, useState, useContext, useRef } from "react";
import { TitleContext } from '../../components/TitleBar/TitleContext'
import { getComments } from '../../utilities/comments-service'
import CommentDisplaySection from "../../components/Discussion/CommentDisplaySection";
import AddCommentForm from "../../components/Discussion/AddCommentForm";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";

export default function DiscussionPage() {

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle("Discussion");
    }, [setTitle]);

    const textInputRef = useRef(null);
    const focusOnTextInput = () => {
        textInputRef.current?.scrollIntoView({ behavior: 'smooth' });
        textInputRef.current?.focus();
    };



    const { loggedInUser, setLoggedInUser } = useLoggedInUser();
    const [parentComment, setParentComment] = useState(null);

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

    function addCommentToList(comment) {
        const updatedComments = [...comments, comment];
        setComments(updatedComments);
    }




    return (
        <>
            <CommentDisplaySection comments={comments} setComments={setComments} setParentComment={setParentComment} focusOnTextInput={focusOnTextInput} x />
            {loggedInUser ? <AddCommentForm parentComment={parentComment} setParentComment={setParentComment} addCommentToList={addCommentToList} textInputRef={textInputRef} /> : <p>Log in to leave a comment.</p>}
        </>
    );
}                