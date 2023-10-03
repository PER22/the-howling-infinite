import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';
import 'react-quill/dist/quill.snow.css'; // note the change in import for styles


function EditSideEssayPage() {
    const {contentId} = useParams();
    console.log(contentId);
    const navigate = useNavigate();

    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [bodyText, setBodyText] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);

    const [coverPhotoURL, setCoverPhotoURL] = useState(''); //Only used for previewing
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if(essayTitle){setTitle(essayTitle);}
    }, [setTitle, essayTitle]);

    
    useEffect(() => {
        async function fetchSideEssayToEdit() {
            try {
                const response = await sendRequest(`/api/content/${contentId}`);
                setEssayTitle(response.title);
                setBodyText(response.bodyText);
                if(response.coverPhotoS3Key){
                    console.log(response.coverPhotoS3Key);
                    const imageResponse = await sendRequest(`/api/content/image-url/${response._id}`);
                    if(imageResponse){setCoverPhotoURL(imageResponse.signedURL);}
                    
                }
            } catch (err) {
                if (err.message !== 'sendRequest failed: {"error":"Essay not found."}') { 
                    // Only set error if it's not about essay absence
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchSideEssayToEdit();
    }, [contentId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', essayTitle);
        formData.append('bodyText', bodyText);
        formData.append('isMain', false);
        formData.append('type', 'essay');
        if (coverPhoto) {
            formData.append('coverPhoto', coverPhoto);
        }
        try {
            if (contentId) {
                // Update existing essay
                await sendRequest(`/api/content/${contentId}`, 'PUT', formData);
                setSuccess('Essay successfully updated!');
                setTimeout(() =>{navigate(`/side-essays/${contentId}`)}, 2000);
            } else {
                // Create new essay
                const response = await sendRequest('/api/content', 'POST', formData);
                setSuccess('Essay successfully created!');
                setTimeout(() =>{navigate(`/side-essays/${response._id}`)}, 2000);
            }
            setError('');
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
            setSuccess('');
        }
    };

    return (
        <div>
            {loading ? <p>Loading...</p> : 
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={essayTitle} onChange={e => setEssayTitle(e.target.value)} required />
                    </div>
                    <div>
                        <label>Body:</label>
                        <Editor innerHTML={bodyText} onChange={setBodyText} />
                    </div>
                    <div>
                        <label>Cover Photo:</label>
                        <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} />
                        {coverPhotoURL &&  
                        <div>
                            <label>Current cover photo: </label>
                            <img src={coverPhotoURL} alt="Current cover img" style={{ maxWidth: '300px', maxHeight: '200px' }}/>
                        </div>}
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            }
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    );
}

export default EditSideEssayPage;
