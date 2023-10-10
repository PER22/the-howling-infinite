import React, { useEffect, useState, useContext } from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';
import 'react-quill/dist/quill.snow.css';
import { useNavigate } from 'react-router-dom';

function EditMainEssayPage() {
    const [essayExists, setEssayExists] = useState(false); //decide whether to PUT or POST
    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [coverPhoto, setCoverPhoto] = useState(null);
    const [htmlFile, setHtmlFile] = useState(null);  // To store the uploaded HTML
    const [imageFolder, setImageFolder] = useState([]);

    const [coverPhotoURL, setCoverPhotoURL] = useState('');

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

//Fetch main essay if it exists
    useEffect(() => {
        async function fetchMainEssayToEdit() {
            try {
                const response = await sendRequest('/api/essays/mainEssay');
                setEssayTitle(response.title);
                setEssayExists(true); // Set essayExists to true
                if (response.coverPhotoS3Key) {
                    console.log(response.coverPhotoS3Key);
                    const imageResponse = await fetch(`/api/images/${response.coverPhotoS3Key}`);
                    if (imageResponse) { setCoverPhotoURL(imageResponse.signedURL); }

                }
            } catch (err) {
                if (err.message !== 'sendRequest failed: {"error":"Essay not found."}') {
                    // Only set error if it's not about essay absence
                    setError(err.message);
                    setEssayExists(false);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchMainEssayToEdit();
    }, []);

   //Handle submission of form
    const handleSubmit = async (e) => {
        e.preventDefault();
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
                await sendRequest(`/api/essays/mainEssay`, 'PUT', formData);
                setSuccess('Essay successfully updated!');
                setError(null);
                setTimeout(() => {
                    navigate('/read');
                }, 2000);
            } else {
                // Create new essay
                await sendRequest('/api/essays', 'POST', formData);
                setSuccess('Essay successfully created!');
                setError(null);
                setTimeout(() => {
                    navigate('/read');
                }, 2000);
            }
            setError('');
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
            setSuccess('');
        }
    };

    //Set page title dynamically
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle(`Editing Main Essay`); 
    }, [setTitle, essayTitle]);

    return (
        <div>
            <h1>Main Essay</h1>
            {loading ? <p>Loading...</p> :
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={essayTitle} onChange={e => setEssayTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label>HTML File:</label>
                        <input type="file" onChange={e => setHtmlFile(e.target.files[0])} required />
                    </div>
                    <div>
                        <label>Images Folder (.fld):</label>
                        <input type="file" webkitdirectory="" directory="" onChange={e => setImageFolder(e.target.files)} required/>
                    </div>
                    <div>
                        <label>Cover Photo:</label>
                        <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} />
                    </div>
                    {coverPhotoURL && <div>
                        <label>Current cover photo: </label>
                        <img src={coverPhotoURL} alt="Current cover img" style={{ maxWidth: '300px', maxHeight: '200px' }} />
                    </div>
                    }
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            }
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
        </div>
    );
}
export default EditMainEssayPage;
