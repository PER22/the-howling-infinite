import React, { useEffect, useState, useContext } from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';
import 'react-quill/dist/quill.snow.css'; 
import { useNavigate } from 'react-router-dom';

function EditMainEssayPage() {
    const [essayExists, setEssayExists] = useState(false); //decide whether to PUT or POST
    const [essayId, setEssayId] = useState(null);

    const [essayTitle, setEssayTitle] = useState(''); //form contents
    const [bodyText, setBodyText] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);

     const [coverPhotoURL, setCoverPhotoURL] = useState('');
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    const navigate = useNavigate();

    
    useEffect(() => {
        async function fetchMainEssayToEdit() {
            try {
                const response = await sendRequest('/api/essays/mainEssay');
                setEssayTitle(response.title);
                setBodyText(response.bodyText);
                setEssayId(response._id);
                setEssayExists(true); // Set essayExists to true
                if(response.coverPhotoS3Key){
                    console.log(response.coverPhotoS3Key);
                    const imageResponse = await sendRequest(`/api/content/image-url/${response._id}`);
                    if(imageResponse){setCoverPhotoURL(imageResponse.signedURL);}
                    
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', essayTitle);
        formData.append('bodyText', bodyText);
        formData.append('isMain', true);
        formData.append('type', 'essay');
        if (coverPhoto) {
            formData.append('coverPhoto', coverPhoto);
        }
        try {
            if (essayId) {
                // Update existing essay
                await sendRequest(`/api/essays/mainEssay`, 'PUT', formData);
                setSuccess('Essay successfully updated!');
                setError(null);
                setTimeout(() => {
                    navigate('/read');
                  }, 2000);
            } else {
                // Create new essay
                await sendRequest('/api/content', 'POST', formData);
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
    
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        if(essayExists){setTitle(`Editing '${essayTitle}'`);}
        else{setTitle("Creating Main Essay");}
    }, [setTitle, essayTitle, essayExists]);
    

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
                        <label>Body:</label>
                        <Editor innerHTML={bodyText} onChange={setBodyText} />
                    </div>
                    <div>
                        <label>Cover Photo:</label>
                        <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} />
                    </div>
                   {coverPhotoURL &&  <div>
                        <label>Current cover photo: </label>
                        <img src={coverPhotoURL} alt="Current cover img" style={{ maxWidth: '300px', maxHeight: '200px' }}/>
                    </div>
                    }
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

export default EditMainEssayPage;
