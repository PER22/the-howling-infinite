import React, { useState } from 'react';
import sendRequest from '../../utilities/send-request';
import Editor from '../../components/TextEditor/Editor';
import 'react-quill/dist/quill.snow.css'; // note the change in import for styles

function EditMainEssayPage() {
    const [title, setTitle] = useState('');
    const [bodyText, setBodyText] = useState('');  // changed from error to manage editor content
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await sendRequest('/api/essays', 'POST', { title, bodyText, isMain: true });
            setSuccess('Essay successfully created!');
            setError('');
        } catch (err) {
            setError('Error creating essay: ' + err.message);
            setSuccess('');
        }
    };

    return (
        <div>
            <h1>Main Essay</h1>
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
                    <button type="submit">Submit</button>
                </div>
            </form>
            {error && <p style={{color: 'red'}}>{error}</p>}
            {success && <p style={{color: 'green'}}>{success}</p>}
        </div>
    );
}

export default EditMainEssayPage;
