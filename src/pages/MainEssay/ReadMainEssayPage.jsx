import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../components/LoggedInUserContext/LoggedInUserContext';
import parse from 'html-react-parser';
import sendRequest from '../../utilities/send-request';
import Footnote from '../../components/Footnote/Footnote';
import AddCommentForm from '../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../components/CommentSection/CommentDisplaySection';
import "./ReadMainEssayPage.css"
import { getCommentsOn } from '../../utilities/comments-service';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';

const options = {
    replace: ({ attribs }) => {
        if (attribs && attribs['data-footnote-content'] && attribs['data-footnote-number']) {
            return <Footnote content={attribs['data-footnote-content']} number={attribs['data-footnote-number']} />;
        }
    }
};


export default function ReadMainEssayPage() {
    const { setTitle } = useContext(TitleContext);
    const { loggedInUser, setLoggedInUser } = useLoggedInUser();
    const [mainEssay, setMainEssay] = useState(null);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (mainEssay) { setTitle(mainEssay.title); }
    }, [setTitle, mainEssay]);

    const [comments, setComments] = useState([]);
    useEffect(() => {
      const fetchPostComments = async () => {
        try {
          if (mainEssay) {
            const tempComments = await getCommentsOn("Essay", mainEssay._id);
            console.log("tempComments;",tempComments);
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
    }, [mainEssay]);

    const handleNewComment = (newComment) => {
        setComments(prevComments => [...prevComments, newComment]);
    };



    useEffect(() => {
        async function fetchMainEssay() {
            try {
                const mainEssay = await sendRequest(`/api/essays/`);
                setMainEssay(mainEssay);
                if (mainEssay) {
                    setError("");
                } else {
                    setError('Essay not found');
                }
            } catch (err) {
                setError('Failed to fetch main essay.')
            }
        }
        fetchMainEssay();
    }, []);


    return (
        <>
            <div className="navigation-container">
                {loggedInUser && loggedInUser.isAdmin && <Link to={`/edit`} className="edit-content-button">Edit This Essay</Link>}
            </div>
            <div className='article-container'>
                {mainEssay ? (
                    <>
                        {parse(mainEssay.bodyHTML, options)}
                    </>
                ) : (
                    <p>Loading...</p>
                )}
                
                <CommentDisplaySection comments={comments} setComments={setComments}/>

                {loggedInUser ? <AddCommentForm entity={mainEssay} entityType='Essay' onNewComment={handleNewComment}/>: <p>Log in to leave a comment.</p>}
                <FeedbackMessage error={error} message={message}/>
            </div>
        </>
    );
}