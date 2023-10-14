import React, { useState, useEffect, useContext } from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import parse from 'html-react-parser';
import sendRequest from '../../utilities/send-request';
import Footnote from '../../components/Footnote/Footnote';
import AddCommentForm from '../../components/CommentSection/AddCommentForm';
import CommentDisplaySection from '../../components/CommentSection/CommentDisplaySection';
import "./ReadMainEssayPage.css"
import { getCommentsOn } from '../../utilities/comments-api';

const options = {
    replace: ({ attribs }) => {
        if (attribs && attribs['data-footnote-content'] && attribs['data-footnote-number']) {
            return <Footnote content={attribs['data-footnote-content']} number={attribs['data-footnote-number']} />;
        }
    }
};


export default function ReadMainEssayPage() {
    const { setTitle } = useContext(TitleContext);
    const [mainEssay, setMainEssay] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        if (mainEssay) { setTitle(mainEssay.title); }
    }, [setTitle, mainEssay]);
    
    const [comments, setComments] = useState([]);
    useEffect(() => {
        const fetchPostComments = async () => {
          try {
            if (mainEssay) {
              const tempComments = getCommentsOn("Essay", mainEssay._id);
              if (tempComments) {
                setComments(tempComments);
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
        <div className='article-container'>
            {mainEssay ? (
                <>
                    {parse(mainEssay.bodyHTML, options)}
                </>
            ) : (
                <p>Loading...</p>
            )}
            {error && <p className='error-message'>{error}</p>}
            <CommentDisplaySection comments={comments} />
            <AddCommentForm entity={mainEssay} entityType='Essay' onNewComment={handleNewComment} />
        </div>
    );
}