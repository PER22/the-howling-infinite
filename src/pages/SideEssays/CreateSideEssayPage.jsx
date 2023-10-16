import React, { useEffect, useState, useContext } from 'react';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { createEssay } from '../../utilities/essays-service';
import { useNavigate } from 'react-router-dom';

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
                }else{
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
                        <input type="file" webkitdirectory="" directory="" onChange={e => setImageFolder(e.target.files)} required />
                    </div>
                    <div>
                        <label>Cover Photo:</label>
                        <input type="file" onChange={e => setCoverPhoto(e.target.files[0])} required/>
                    </div>
                    <div>
                        <button type="submit">Submit</button>
                    </div>
                </form>
            }
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
        </div>
    );
}
export default CreateSideEssayPage;
