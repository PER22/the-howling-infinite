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

    

    const { loggedInUser } = useLoggedInUser();
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

    function replaceCommentInList(updatedComment, id){
        let updatedComments = comments.map(comment => {
            if (comment._id === id) {
                return updatedComment;
            }
            return comment;
        });
        setComments(updatedComments);
    }    

    return (
        <>
            <CommentDisplaySection
                comments={comments}
                setComments={setComments}
                switchToEditing={switchToEditing}
                switchToReplying={switchToReplying} />
            {loggedInUser ?
                <AddCommentForm
                    textInputRef={textInputRef}
                    addCommentToList={addCommentToList}
                    replaceCommentInList={replaceCommentInList}
                    parentComment={parentComment}
                    commentToBeEdited={commentToBeEdited}
                    cancelEdit={cancelEdit}
                    cancelReply={cancelReply}
                />
                :
                <p>Log in to leave a comment.</p>}
        </>
    );
}                