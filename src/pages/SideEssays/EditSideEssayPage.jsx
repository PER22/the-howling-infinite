import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, TextField, Input, InputLabel, FormControl, Box } from '@mui/material';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../components/LoggedInUserContext/LoggedInUserContext';
import { getSideEssay, updateSideEssay, deleteEssay } from '../../utilities/essays-service'
import UnauthorizedBanner from '../../components/UnauthorizedBanner/UnauthorizedBanner';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import 'react-quill/dist/quill.snow.css'; // note the change in import for styles
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';


function EditSideEssayPage() {
    const { essayId } = useParams();
    const navigate = useNavigate();

    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [coverPhoto, setCoverPhoto] = useState('');
    const [htmlFile, setHtmlFile] = useState('');  // To store the uploaded HTML
    const [imageFolder, setImageFolder] = useState([]);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState(null);

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if (essayTitle) { setTitle(essayTitle); }
    }, [setTitle, essayTitle]);

    const { loggedInUser, setLoggedInUser } = useLoggedInUser();


    useEffect(() => {
        async function fetchSideEssayToEdit() {
            if (essayId) {
                try {
                    const response = await getSideEssay(essayId);
                    setEssayTitle(response.title || '');
                } catch (err) {
                    setError(err.message);
                } finally {
                    setLoading(false);
                }
            }
        }
        fetchSideEssayToEdit();
    }, [essayId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
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
            // Update existing essay
            const response = await updateSideEssay(essayId, formData);
            if (!response.error) {
                setMessage('Essay successfully updated!');
                setTimeout(() => { navigate(`/side-essays/${essayId}`) }, 2000);
            } else { setError(response.error); }
            setError('');
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
            setMessage('');
        }
    };


    const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false);
    const closeModal = () => { setShowDeleteConfirmationModal(false) };
    const openModal = () => { setShowDeleteConfirmationModal(true) };

    const handleDelete = async (e) => {
        if (essayId) {
            try {
                const response = await deleteEssay(essayId);
                if (!response.error) {
                    setMessage(response.message);
                    setTimeout(() => { navigate('/side-essays'); }, 2000)
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
    };

    if (!loggedInUser || !loggedInUser.isAdmin) {
        return <UnauthorizedBanner />
    }
    else return (
        <div>
            {loading ? <p>Loading...</p> :
                <>
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

                    <Button variant="contained" color="warning" onClick={openModal} sx={{marginTop: "3rem"}}>
                        Delete
                    </Button>
                    {showDeleteConfirmationModal && <ConfirmationModal closeFunction={closeModal} deleteFunction={handleDelete} confirmationText={"This will permanently delete this essay, and can not be undone."} contentId={essayId}/>}
                </>
            }
            <FeedbackMessage error={error} message={message}/>
        </div>
    );
}

export default EditSideEssayPage;
