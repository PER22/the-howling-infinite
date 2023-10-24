import React, { useEffect, useState, useContext } from 'react';
import { Button, TextField, Input, InputLabel, FormControl, Box } from '@mui/material';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { createEssay } from '../../utilities/essays-service';
import { useNavigate } from 'react-router-dom';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';

function CreateSideEssayPage() {
    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [htmlFile, setHtmlFile] = useState(null);  // To store the uploaded HTML
    const [imageFolder, setImageFolder] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(null);

    const navigate = useNavigate();


    //Handle submission of form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append('title', essayTitle);
        formData.append('isMain', false);
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

            // Create new essay
            const newEssay = await createEssay(formData);
            if (!newEssay.error) {
                setLoading(false);
                // setMessage(newEssay.message);
                setError(null);
                setTimeout(() => {
                    navigate(`/side-essays/${newEssay.data._id}`);
                }, 2000);
            } else {
                setLoading(false);
                setError(newEssay.error);
                setMessage(null);
            }



        } catch (err) {
            setError('Error creating side essay: ' + err.message);
            setMessage('');
        }
    };

    //Set page title dynamically
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle(`Creating Side Essay`);
    }, [setTitle, essayTitle]);

    return (
        <div>
            <h1>Side Essay</h1>
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
                        <InputLabel htmlFor="images-folder">Images Folder (.fld)</InputLabel>
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
                        />
                    </Box>

                    <Button variant="contained" color="primary" type="submit">
                        Submit
                    </Button>
                </form>
            }
            <FeedbackMessage error={error} message={message} />
        </div>
    );
}
export default CreateSideEssayPage;
