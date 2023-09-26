import React, { useEffect, useState } from 'react';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';
import 'react-quill/dist/quill.snow.css'; // note the change in import for styles

function EditSideEssayPage() {
    const [essayExists, setEssayExists] = useState(false); //decide whether to PUT or POST
    const [essayId, setEssayId] = useState(null);

    const [title, setTitle] = useState(''); //form contents
    const [bodyText, setBodyText] = useState('');
    const [coverPhoto, setCoverPhoto] = useState(null);

    const [coverPhotoURL, setCoverPhotoURL] = useState(''); //for preview purposes
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(null);

    
    useEffect(() => {
        async function fetchSideEssayToEdit() {
            try {
                const response = await sendRequest('/api/essays/sideEssay');
                setTitle(response.title);
                setBodyText(response.bodyText);
                setEssayId(response._id);
                setEssayExists(true); // Set essayExists to true
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
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('bodyText', bodyText);
        formData.append('isMain', false);
        if (coverPhoto) {
            formData.append('coverPhoto', coverPhoto);
        }
        try {
            if (essayId) {
                // Update existing essay
                const response = await sendRequest(`/api/essays/mainEssay`, 'PUT', formData);
                setSuccess('Essay successfully updated!');
            } else {
                // Create new essay
                const response = await sendRequest('/api/essays', 'POST', formData);
                setSuccess('Essay successfully created!');
            }
            setError('');
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
            setSuccess('');
        }
    };

    return (
        <div>
            <h1>Side Essay Editing Page</h1>
            {loading ? <p>Loading...</p> : 
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Title:</label>
                        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
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
