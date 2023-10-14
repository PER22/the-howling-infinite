import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { createEssay } from '../../utilities/essays-service';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';

function CreateSideEssayPage() {
    const [formContents, setFormContents] = useState(
        { 
            essayTitle: '',
            htmlFile: null,
            imageFolder: null,
            coverPhoto: null,
        }
    );
    const setEssayTitle = (title)=>{
        setFormContents({
            ...formContents,
            essayTitle : title
        });
    };
    const setHtmlFile = (file)=>{
        setFormContents({
            ...formContents,
            htmlFile : file
        });
    };
    const setImageFolder = (folder)=>{
        setFormContents({
            ...formContents,
            imageFolder : folder
        });
    };
    const setCoverImage = (image)=>{
        setFormContents({
            ...formContents,
            coverPhoto : image
        });
    };
 

    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('New Side Essay');
    }, [setTitle]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('title', formData.essayTitle);
        formData.append('isMain', false);
        // Finish adding form data
        
        try {
            const response = await createEssay(formData);
            if(!response.error){
                setMessage('Side Essay successfully created!');
            setTimeout(() => {
                navigate(`/side-essays/${response.data._id}`);
              }, 2000);
            setError('');
            }else{
                setError(response.error);
            }
        } catch (err) {
            setError('Error creating side essay: ' + err.message);
            setMessage('');
        }
    };
    
    return (
        <div>
            <h1>Side Essay</h1> 
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input type="text" value={formContents.essayTitle} onChange={e => setEssayTitle(e.target.value)} required />
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
                    <input type="file" onChange={e => setCoverImage(e.target.files[0])} />
                </div>
                <div>
                    <button type="submit">Submit</button>
                </div>
            </form>
            <FeedbackMessage error={error} message={message}/>
        </div>
    );
}

export default CreateSideEssayPage;
