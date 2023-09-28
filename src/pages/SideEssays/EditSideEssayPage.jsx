import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';
import 'react-quill/dist/quill.snow.css'; // note the change in import for styles


function EditSideEssayPage() {
    const {essayId} = useParams();
    const navigate = useNavigate();

    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [bodyText, setBodyText] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);

    // const [coverPhotoURL, setCoverPhotoURL] = useState(''); //for preview purposes
    
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
                const response = await sendRequest(`/api/essays/sideEssays/${essayId}`);
                console.log("response ", response);
                setEssayTitle(response.title);
                setBodyText(response.bodyText);
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
    }, [essayId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', essayTitle);
        formData.append('bodyText', bodyText);
        formData.append('isMain', false);
        if (coverPhoto) {
            formData.append('coverPhoto', coverPhoto);
        }
        try {
            if (essayId) {
                // Update existing essay
                await sendRequest(`/api/essays/mainEssay`, 'PUT', formData);
                setSuccess('Essay successfully updated!');
                setTimeout(() =>{navigate(`/side-essays/${essayId}`)}, 2000);
            } else {
                // Create new essay
                const response = await sendRequest('/api/essays', 'POST', formData);
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
                        {/* {!imageError $$ <img src=`${getSignedURLForEssayCoverImage}`} */}
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
