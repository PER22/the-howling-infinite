import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField, Input, InputLabel, FormControl, Box } from '@mui/material';
import { CloudUpload } from '@mui/icons-material';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../components/LoggedInUserContext/LoggedInUserContext';
import { getMainEssay } from '../../utilities/essays-service';
import { updateMainEssay } from '../../utilities/essays-service';
import { createEssay } from '../../utilities/essays-service';
import { getSignedURLForImage } from '../../utilities/images-service';

import { useNavigate } from 'react-router-dom';
import UnauthorizedBanner from '../../components/UnauthorizedBanner/UnauthorizedBanner';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';

export default function EditMainEssayPage() {
    const [essayExists, setEssayExists] = useState(false); //decide whether to PUT or POST
    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [htmlFile, setHtmlFile] = useState(null);  // To store the uploaded HTML
    const [imageFolder, setImageFolder] = useState([]);

    const [coverPhotoURL, setCoverPhotoURL] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();

    //Fetch main essay if it exists
    useEffect(() => {
        async function fetchMainEssayToEdit() {
            try {
                const response = await getMainEssay();
                if (!response.error) {
                    setEssayTitle(response.title);
                    setEssayExists(true); // Set essayExists to true
                    if (response.coverPhotoS3Key) {
                        console.log(response.coverPhotoS3Key);
                        const imageResponse = await getSignedURLForImage(response.coverPhotoS3Key);
                        if (imageResponse) {
                            setCoverPhotoURL(imageResponse.signedURL);
                        }
                    }
                } else {
                    setError(response.error);
                }
            } catch (err) {
                    // Only set error if it's not about essay absence
                    setError(err.message);
                    setEssayExists(false);
            } finally {
                setLoading(false);
            }
        }
        fetchMainEssayToEdit();
    }, []);

    //Handle submission of form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const formData = new FormData();
        formData.append('title', essayTitle);
        formData.append('isMain', true);
        if (coverPhoto) {
            formData.append('coverPhoto', coverPhoto);
        }
        if (htmlFile) {
            formData.append('html', htmlFile);
        }
        if (imageFolder) {
            for (let i = 0; i < imageFolder.length; i++) {
                formData.append('folderFiles', imageFolder[i]);
            }
        }
        try {
            if (essayExists) {
                // Update existing essay
                const response = await updateMainEssay(formData);
                if (!response.error) {
                    setMessage('Essay successfully updated!');
                    setError(null);
                    setTimeout(() => {
                        navigate('/read');
                    }, 2000);
                }
            } else {
                // Create new essay
                const newEssay = await createEssay(formData);
                if (!newEssay.error) {
                    // setMessage(newEssay.message);
                    setError(null);
                    setTimeout(() => {
                        navigate('/read');
                    }, 2000);
                } else {
                    setError(newEssay.error);
                }

            }
            setError('');
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
            setMessage('');
        }
    };

    //Set page title dynamically
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle(`Editing Main Essay`);
    }, [setTitle, essayTitle]);

    const { loggedInUser, setLoggedInUser } = useLoggedInUser();

    if (!loggedInUser || !loggedInUser.isAdmin) {
        return <UnauthorizedBanner />
    }
    return (
        <div>
            <h1>Main Essay</h1>
            {loading ? <p>Loading...</p> :
                <form onSubmit={handleSubmit} noValidate autoComplete="off">
                    <Box marginBottom={2}>
                        <TextField
                            fullWidth
                            label="Title"
                            variant="outlined"
                            value={essayTitle}
                            onChange={e => setEssayTitle(e.target.value)}
                            required
                        />
                    </Box>

                    <Box marginBottom={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="HTML File"
                            type="file"
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setHtmlFile(e.target.files[0])}
                            required
                        />
                    </Box>

                    <Box marginBottom={2}>
                        <InputLabel htmlFor="images-folder">Images Folder (.fld) *</InputLabel>
                        <input
                            style={{ display: 'none' }}
                            id="images-folder"
                            multiple
                            type="file"
                            webkitdirectory=""
                            directory=""
                            onChange={e => setImageFolder(e.target.files)}
                        />
                        <label htmlFor="images-folder">
                            <Button variant="outlined" component="span">
                                Choose Files
                            </Button>
                        </label>
                    </Box>

                    <Box marginBottom={2}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Cover Photo"
                            type="file"
                            InputLabelProps={{ shrink: true }}
                            onChange={e => setCoverPhoto(e.target.files[0])}
                            required
                        />
                    </Box>

                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </form>
            }
            <FeedbackMessage error={error} message={message}/>
        </div>
    );
}
