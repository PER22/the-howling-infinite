import React, { useEffect, useState } from 'react';
import { TextField, Box, Button, Typography } from '@mui/material';
import SectionList from './SectionList';
import { v4 as uuidv4 } from 'uuid';
import { CloudUpload } from '@mui/icons-material';
import { getSignedURLForImage } from '../../utilities/images-service';
import './EssayForm.css'

function EssayForm({ essayExists, initialTitle, initialSections, initialCoverPhoto, onSubmit }) {
    const [title, setTitle] = useState(initialTitle || '');
    const [essayCoverImageFile, setEssayCoverImageFile] = useState(null);
    const [essayCoverPhotoSignedUrl, setEssayCoverPhotoSignedUrl] = useState(null);

    const [sections, setSections] = useState(initialSections || []);

    useEffect(() => {
        async function getCoverPhotoImageFromS3() {
            if (initialCoverPhoto) {
                const signedUrl = await getSignedURLForImage(initialCoverPhoto);
                setEssayCoverPhotoSignedUrl(signedUrl.data.url);
            }

        }
        getCoverPhotoImageFromS3();
    }, [initialCoverPhoto]);

    const addSection = (type, initData) => {
        const newSection = { type, id: uuidv4(), data: initData || {} };
        if (!initData) {
            if (type === 'Chapter') {
                newSection.data = {
                    ...newSection.data,
                    title: '',
                    number: sections.filter(s => s.type === 'Chapter').length + 1,
                    pdf: null,
                    pdfS3Key: '',
                    newUpload: true,
                    newSection: true
                };
            } else if (type === 'Interlude') {
                newSection.data = {
                    ...newSection.data,
                    title: '',
                    number: sections.filter(s => s.type === 'Chapter').length + 1,
                    youtubeLink: ''
                };
            }
        }
        setSections(prevSections => [...prevSections, newSection]);
    };

    const removeSection = (index) => {
        setSections(sections => sections.filter((_, i) => i !== index));
    };

    const updateSectionData = (index, key, value) => {
        const updatedSections = sections.map((section, i) => {
            if (i === index) {
                const updatedData = { ...section.data };
                if (key === 'pdf' && value) {
                    updatedData[key] = { name: value.name, file: value };
                    updatedData["newUpload"] = true;
                } else {
                    updatedData[key] = value;
                }
                return { ...section, data: updatedData };
            }
            return section;
        });
        setSections(prevSections => updatedSections)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(title, sections, essayCoverImageFile);
    };

    const handleCoverImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEssayCoverImageFile(file);

        }
    };

    return (
        <form onSubmit={handleSubmit} noValidate autoComplete="off">
            <Box marginBottom={2}>
                <TextField
                    fullWidth
                    label="Title"
                    variant="outlined"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
                <input
                    accept="image/*"
                    style={{ display: 'none' }}
                    id={`input-essay-cover-photo-file`}
                    type="file"
                    onChange={handleCoverImageChange}
                />
                <label htmlFor={`input-essay-cover-photo-file`}>
                    <Button variant="contained" component="span" startIcon={<CloudUpload />}>
                        Cover Photo
                    </Button>
                </label>
                {!essayCoverImageFile && essayCoverPhotoSignedUrl && <img alt="" className={"current-cover-photo"} src={essayCoverPhotoSignedUrl}></img>}
                <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                    {essayCoverImageFile ? essayCoverImageFile.name : initialCoverPhoto || 'No file selected.'}
                </Typography>
            </Box>
            <SectionList
                sections={sections}
                setSections={setSections}
                updateSectionData={updateSectionData}
                removeSection={removeSection}
                addSection={addSection}
            />
            <Button variant="contained" color="primary" type="submit">
                {essayExists ? 'Update Essay' : 'Create Essay'}
            </Button>
        </form>
    );
}

export default EssayForm;
