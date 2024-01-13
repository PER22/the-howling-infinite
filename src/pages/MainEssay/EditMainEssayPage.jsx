import React, { useEffect, useState, useContext } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import EssayForm from '../../components/EssayUploadComponents/EssayForm';
import { TitleContext } from '../../components/TitleBar/TitleContext';
import { useLoggedInUser } from '../../components/LoggedInUserContext/LoggedInUserContext';
import { getMainEssay, updateMainEssay, createEssay } from '../../utilities/essays-service';
import UnauthorizedBanner from '../../components/UnauthorizedBanner/UnauthorizedBanner';
import FeedbackMessage from '../../components/FeedbackMessage/FeedbackMessage';

export default function EditMainEssayPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [essayTitle, setEssayTitle] = useState('');
    const [sections, setSections] = useState([]);
    const [essayExists, setEssayExists] = useState(false);

    const { setTitle } = useContext(TitleContext);
    const { loggedInUser } = useLoggedInUser();
    const navigate = useNavigate();

    useEffect(() => {
        setTitle('Editing Main Essay');
    }, [setTitle]);

    

    useEffect(() => {

        const addSection = (type, initData) => {
            const newSection = { type, id: uuidv4(), data: initData || {} };
            if (!initData) {
                if (type === 'Chapter') {
                    newSection.data = {
                        ...newSection.data,
                        title: '',
                        number: sections.filter(s => s.type === 'Chapter').length,
                        pdf: null,
                        pdfS3Key: ''
                        
                    };
                } else if (type === 'Interlude') {
                    newSection.data = {
                        ...newSection.data,
                        title: '',
                        number: sections.filter(s => s.type === 'Chapter').length,
                        youtubeLink: ''
                    };
                }
            }
            setSections(prevSections => [...prevSections, newSection]);
        };

        const fetchMainEssayToEdit = async () => {
            try {
                const response = await getMainEssay();
                if (response.error) {
                    setError(response.error);
                    setEssayExists(false);
                } else {
                    setEssayTitle(response.data.title);
                    setEssayExists(true);
    
                    response.data.sections.forEach(section => {
                        addSection(section.type, section);
                    }); 
                }
            } catch (err) {
                setError(err.message);
                setEssayExists(false);
            } finally {
                setLoading(false);
            }
        };
    
        fetchMainEssayToEdit();
    }, []);
    

    

    const handleEssaySubmit = async (title, sections) => {
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('isMain', true);


            // Stringify the entire array of sections and add it to formData
            const sectionsData = sections.map(section => ({
                title: section.data.title,
                number: section.data.number,
                type: section.type,
                index: section.index,
                youtubeLink: section.type === 'Interlude' ? section.data.youtubeLink : undefined,
                pdfS3Key: section.type === 'Chapter' ? section.data.pdfS3Key : undefined
            }));

            formData.append('sections', JSON.stringify(sectionsData));

            const response = essayExists ? await updateMainEssay(formData) : await createEssay(formData);
            if (response.error) {
                setError(response.error);
            } else {
                setMessage(essayExists ? 'Essay successfully updated!' : 'Essay successfully created!');
                setTimeout(() => navigate('/read'), 2000); // Navigate after a delay
            }
        } catch (err) {
            setError('Error creating/updating main essay: ' + err.message);
        } finally {
            setLoading(false);
        }
    };




    if (!loggedInUser || !loggedInUser.isAdmin) {
        return <UnauthorizedBanner />;
    }

    return (
        <div>
            <h1>Edit Main Essay</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <EssayForm
                    initialTitle={essayTitle}
                    initialSections={sections}
                    onSubmit={handleEssaySubmit}
                />
            )}
            <FeedbackMessage error={error} message={message} />
        </div>
    );
}
