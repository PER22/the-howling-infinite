import React, { useState } from 'react';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';

function EditSideEssayPage() {
    const [title, setTitle] = useState('');
    const [bodyText, setBodyText] = useState('');
    const [coverPhoto, setCoverPhoto]= useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', title);
        formData.append('bodyText', bodyText);
        formData.append('isMain', false);
        if (coverPhoto) {
            //console.log("coverPhoto is truthy");
            formData.append('coverPhoto', coverPhoto);
        }
        try {
            // console.log("formData",formData);
            const response = await sendRequest('/api/essays', 'POST', formData);
            setSuccess('Side Essay successfully created!');
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
                    <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
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

export default EditSideEssayPage;
