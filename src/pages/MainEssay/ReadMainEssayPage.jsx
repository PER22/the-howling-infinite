import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import moment from 'moment';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Star from '@mui/icons-material/Star';
import StarBorder from '@mui/icons-material/StarBorder';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../components/LoggedInUserContext/LoggedInUserContext';
import "./ReadMainEssayPage.css"
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';
import { getMainEssay, starEssayById, unstarEssayById } from '../../utilities/essays-service';

import { Document, Page, pdfjs } from "react-pdf";
import * as pdfjsLib from 'pdfjs-dist/webpack.mjs';


import { getSignedURLForImage } from '../../utilities/images-service';
import { TextField, Tooltip } from '@mui/material';

pdfjs.GlobalWorkerOptions.workerSrc = '/src/pdf.worker.min.js';


export default function ReadMainEssayPage() {
    const { setTitle } = useContext(TitleContext);
    const navigator = useNavigate();


    const { loggedInUser, setLoggedInUser } = useLoggedInUser();
    const [mainEssay, setMainEssay] = useState(null);
    useEffect(() => {
        if (mainEssay) { setTitle(mainEssay.title); }
    }, [setTitle, mainEssay]);


    const [essayIsStarred, setEssayIsStarred] = useState(loggedInUser?._id && mainEssay && mainEssay?.stars?.includes(loggedInUser?._id));
    const [numStars, setNumStars] = useState(mainEssay && mainEssay.numStars);


    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState(currentPage.toString());
    const [sections, setSections] = useState([]);
    const [currentSignedUrl, setCurrentSignedUrl] = useState(null);
    const [sectionPageCounts, setSectionPageCounts] = useState({});
    const [currentNumPages, setCurrentNumPages] = useState(1);
    const [scale, setScale] = useState(1.5);
    const [renderedPage, setRenderedPage] = useState(null);


    const memoizedFile = useMemo(() => ({ url: currentSignedUrl }), [currentSignedUrl]);

    const isLoading = renderedPage !== currentPage;

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

    const handleNextPage = () => {
        if (currentPage < sectionPageCounts[currentSectionIndex]) {
            // Still pages left in the current section
            setCurrentPage(currentPage => currentPage + 1);
            setInputPage(inputPage => currentPage + 1);
        } else if (currentSectionIndex < sections.length - 1) {
            // Move to the next section
            setCurrentSectionIndex(currentSectionIndex => currentSectionIndex + 1);
            setCurrentPage(1);
            setInputPage(inputPage => currentPage);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            // Move to the previous page within the section
            setCurrentPage(currentPage => currentPage - 1);
            setInputPage(inputPage => currentPage - 1);
        } else if (currentSectionIndex > 0) {
            // Move to the previous section
            setCurrentSectionIndex(currentSectionIndex => currentSectionIndex - 1);
            // Set page to the last page of the previous section
            setCurrentPage(sectionPageCounts[currentSectionIndex - 1] || 1);
            setInputPage(sectionPageCounts[currentSectionIndex - 1] || 1);
        }
    };

    const handleChange = (event) => {
        let value = event.target.value;
        if (value === '' || (isFinite(value) && value.length <= 3)) {
            setInputPage(value); // Update the inputPage state
        }
    };


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            const pageNumber = Math.max(1, Math.min(Number(inputPage), currentNumPages));
            setCurrentPage(pageNumber); // Update the currentPage state with the validated inputPage value
            setInputPage(pageNumber);
        }
    };


    const handleDownscalePage = () => {
        setScale(currentScale => Math.max(currentScale - 0.1 || 1, 1))
    }

    const handleUpscalePage = () => {
        setScale(currentScale => Math.min(currentScale + 0.1 || 3, 3))
    }

    function useNavigateToLogin() {

    }

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
                if (response && !response.error) {
                    setMainEssay(response.data);
                    setSections(response.data.sections);
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

    useEffect(() => {
        async function getPdfFromS3() {
            if (sections.length > 0) {
                try {
                    const signedURL = await getSignedURLForImage(sections[currentSectionIndex].pdfS3Key);
                    if (signedURL && !signedURL.error) {
                        setCurrentSignedUrl(signedURL.data.url);
                    } else {
                        console.error('Received empty signed URL');
                    }
                } catch (error) {
                    console.error('Error fetching signed URL:', error.message);
                }
            }
        }
        getPdfFromS3();
    }, [currentSectionIndex, sections]);

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

            <div className="page-controls">
                {sections && sections[currentSectionIndex] && sections[currentSectionIndex]?.type === 'Chapter' && <><TextField
                    className='page-number-input'
                    inputProps={{
                        maxLength: 3,
                        pattern: "[0-9]*",
                        style: { color: 'black', backgroundColor: 'rgba(200,200,200,0.9)', borderRadius: '4px' }
                    }}
                    value={inputPage}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    style={{ width: '4em', color: 'white' }}
                >{currentPage}</TextField>
                    <IconButton className="page-scale-button" onClick={handleUpscalePage} style={{ color: 'white' }}>
                        <ZoomInIcon fontSize='large' />
                    </IconButton>
                    <IconButton className="page-scale-button" onClick={handleDownscalePage} style={{ color: 'white' }}>
                        <ZoomOutIcon fontSize='large' />
                    </IconButton></>}
                <IconButton className="page-navigation-button" onClick={handlePreviousPage} style={{ color: 'white' }}>
                    <ArrowBackIosNewIcon fontSize='large' />
                </IconButton>
                <IconButton className="page-navigation-button" onClick={handleNextPage} style={{ color: 'white' }}>
                    <ArrowForwardIosIcon fontSize='large' />
                </IconButton>
            </div>

            <div>
                <div style={{ display: 'flex' }}>
                    <h1> {sections[currentSectionIndex]?.title}</h1>
                    <Box className="star-info" display="flex" alignItems={'center'}>
                        {loggedInUser &&
                            <IconButton onClick={!essayIsStarred ? () => handleStarEssay(mainEssay._id) : () => handleUnstarEssay(mainEssay._id)}>
                                {!essayIsStarred ?
                                    <StarBorder color="action" /> :
                                    <Star color="primary" />
                                }
                            </IconButton>
                        }
                        {!loggedInUser &&
                            <Tooltip title="Log in to star content">
                                <IconButton onClick={() => navigator('/auth')} >
                                    <Star color="primary" />
                                </IconButton>
                            </Tooltip>}
                        <Typography variant="body1" className="num-stars">
                            {numStars}
                        </Typography>
                    </Box>

                </div>
                <h3>By Dr. Gene Lohser</h3>
                <h4>Last updated at {moment(sections[currentSectionIndex]?.updatedAt).format('MM/DD/YYYY hh:mm a')}</h4>


                <FeedbackMessage error={error} message={message} />
            </div>

            <div className="content-container">
                {sections && sections[currentSectionIndex] && sections[currentSectionIndex]?.type === 'Chapter' ? (
                    <div>
                        {currentSignedUrl &&
                            <Document className={"document"} file={memoizedFile} onLoadSuccess={
                                ({ numPages }) => {
                                    setSectionPageCounts(prevCounts => ({
                                        ...prevCounts,
                                        [currentSectionIndex]: numPages
                                    }));
                                    setCurrentNumPages(numPages);
                                }
                            }>
                                {isLoading && renderedPage &&
                                    <Page
                                        key={renderedPage}
                                        className={"page"}
                                        scale={scale}
                                        pageNumber={renderedPage}
                                        renderTextLayer={false}
                                        renderAnnotationLayer={false}
                                    />
                                }
                                <Page
                                    className={"page"}
                                    scale={scale}
                                    key={currentPage}
                                    pageNumber={currentPage}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    onRenderSuccess={() => setRenderedPage(currentPage)} />
                            </Document>}


                    </div>
                ) : sections[currentSectionIndex]?.type === 'Interlude' ? (

                    <iframe
                        title="interlude-content"
                        width={900}
                        height={500}
                        src={sections[currentSectionIndex].youtubeLink}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                ) : null}

            </div>


        </>
    );
}

