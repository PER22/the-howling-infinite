import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { getSideEssay, updateSideEssay} from '../../utilities/essays-service'
import 'react-quill/dist/quill.snow.css'; // note the change in import for styles


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


    useEffect(() => {
        async function fetchSideEssayToEdit() {
            if(essayId){
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
                if(!response.error){
                    setMessage('Essay successfully updated!');
                    setTimeout(() => { navigate(`/side-essays/${essayId}`) }, 2000);
                }else{setError(response.error);}
            setError('');
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
            setMessage('');
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

export default EditSideEssayPage;
