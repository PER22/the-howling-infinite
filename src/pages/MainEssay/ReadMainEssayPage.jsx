import React, { useState, useEffect, useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import Button from '@mui/material/Button';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../components/LoggedInUserContext/LoggedInUserContext';
import "./ReadMainEssayPage.css"
import { getCommentsOn } from '../../utilities/comments-service';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';
import { getMainEssay, starEssayById, unstarEssayById } from '../../utilities/essays-service';

const greyStarIcon = require("../../assets/greystar.png");
const starIcon = require('../../assets/star.png');


export default function ReadMainEssayPage() {
    const { setTitle } = useContext(TitleContext);


    const { loggedInUser, setLoggedInUser } = useLoggedInUser();
    const [mainEssay, setMainEssay] = useState(null);
    useEffect(() => {
        if (mainEssay) { setTitle(mainEssay.title); }
    }, [setTitle, mainEssay]);
    

    const [essayIsStarred, setEssayIsStarred] = useState(loggedInUser?._id && mainEssay && mainEssay?.stars?.includes(loggedInUser?._id));
    const [numStars, setNumStars] = useState(mainEssay && mainEssay.numStars);


    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const handleStarEssay = async (mainEssay) => {
        if (!loggedInUser?.isVerified) { return; }
        try {
            const response = await starEssayById(mainEssay);
            if (!response.error) {
                setMainEssay(prevEssay => ({
                    ...prevEssay,
                    stars: response.data.stars,
                    numStars: response.data.numStars
                }));
                setError(null);
            }
            else { setError(response.error); }
        } catch (err) {
            console.log(err);
            setError("Error starring post.");
        }
    };

    const handleUnstarEssay = async (mainEssay) => {
        if (!loggedInUser?.isVerified) { return; }
        try {
            const response = await unstarEssayById(mainEssay);
            if (!response.error) {
                setMainEssay(prevEssay => ({
                    ...prevEssay,
                    stars: response.data.stars,
                    numStars: response.data.numStars
                }));
                setError(null);
            } else {
                setError(response.error);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        setEssayIsStarred(loggedInUser?._id && mainEssay && mainEssay?.stars?.includes(loggedInUser?._id));
      }, [mainEssay, loggedInUser?._id]);
    
      useEffect(() => {
        setNumStars(mainEssay && mainEssay.numStars);
      }, [mainEssay]);


    
    useEffect(() => {
        async function fetchMainEssay() {
            try {
                const response = await getMainEssay();
                if (!response.error) {
                    setMainEssay(response.data);
                    setError("");
                } else {
                    setError(response.error);
                }
            } catch (err) {
                setError('Failed to fetch main essay.');
            }
        }
        fetchMainEssay();
    }, []);


    return (
        <>
            <div className="navigation-container">
            {loggedInUser?.isAdmin && (
        <Button 
          component={RouterLink} 
          to="/edit" 
          variant="contained" 
          color="primary" 
          className="edit-content-button"
        >
          Edit This Essay
        </Button>
      )}
            </div>
            <div className='article-container'>
                { mainEssay?.bodyHTML && <div className='no-select' dangerouslySetInnerHTML={{__html: mainEssay.bodyHTML}}/>}
                <div className="star-info">
                    {loggedInUser && <img
                        src={!essayIsStarred? greyStarIcon : starIcon}
                        className="star-icon"
                        alt="Star"
                        onClick={!essayIsStarred ? () => handleStarEssay(mainEssay._id) : () => handleUnstarEssay(mainEssay._id)}
                    />}
                    <span className="num-stars">{numStars} star{numStars === 1 ? "" : "s"}</span>
                </div>

                <FeedbackMessage error={error} message={message} />
            </div>
        </>
    );
}