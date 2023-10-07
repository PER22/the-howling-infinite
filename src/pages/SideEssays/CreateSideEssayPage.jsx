import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';

function CreateSideEssayPage() {
    const [essayTitle, setEssayTitle] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [coverPhoto, setCoverPhoto]= useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('New Side Essay');
    }, [setTitle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', essayTitle);
        formData.append('bodyText', bodyText);
        formData.append('isMain', false);
        formData.append('type', 'essay');
        //is chapter number required?
        if (coverPhoto) {
            formData.append('coverPhoto', coverPhoto);
        }
        try {
            const response = await sendRequest('/api/essays', 'POST', formData);
            setSuccess('Side Essay successfully created!');
            setTimeout(() => {
                navigate(`/side-essays/${response.essay._id}`);
              }, 2000);
            setError('');
        } catch (err) {
            setError('Error creating side essay: ' + err.message);
            setSuccess('');
        }
    };
    
    return (
        <div>
            <h1>Side Essay</h1> 
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={essayTitle} onChange={e => setEssayTitle(e.target.value)} required />
                </div>
                <div>
                    <label>Body:</label>
                    <Editor onChange={setBodyText}/>
                </div>
                <div>
                    <label>Cover Photo:</label>
                    <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    );
}

export default CreateSideEssayPage;
