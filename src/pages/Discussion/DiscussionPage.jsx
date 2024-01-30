import { useEffect, useState, useContext, useRef } from "react";
import { TitleContext } from '../../components/TitleBar/TitleContext'
import { getComments } from '../../utilities/comments-service'
import CommentDisplaySection from "../../components/Discussion/CommentDisplaySection";
import AddCommentForm from "../../components/Discussion/AddCommentForm";
import { useLoggedInUser } from "../../components/LoggedInUserContext/LoggedInUserContext";
import './DiscussionPage.css'
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
    const [commentToBeEdited, setCommentToBeEdited] = useState(null);
    const [comments, setComments] = useState([]);

    const switchToReplying = (comment) => {
        cancelEdit();
        focusOnTextInput();
        setParentComment(comment)
    };

    const switchToEditing = (comment) => {
        cancelReply();
        focusOnTextInput();
        setCommentToBeEdited(comment);
        //setTextFieldContent(comment.text);
    }

    const cancelReply = () => {
        setParentComment(null);
    }

    const cancelEdit = () => {
        setCommentToBeEdited(null);
    };




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
            <CommentDisplaySection comments={comments} setComments={setComments} switchToEditing={switchToEditing} switchToReplying={switchToReplying} />
            {loggedInUser ?
                <AddCommentForm
                    textInputRef={textInputRef} //used for scrolling/focusing on the text input.
                    addCommentToList={addCommentToList}
                    parentComment={parentComment}
                    commentToBeEdited={commentToBeEdited}
                    setCommentToBeEdited={setCommentToBeEdited}
                />
                :
                <p>Log in to leave a comment.</p>}
        </>
    );
}                