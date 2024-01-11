import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import SectionList from './SectionList';

function EssayForm({ essayExists, onSubmit }) {
    const [title, setTitle] = useState('');
    const [sections, setSections] = useState([]);
    const addSection = (type) => {
        const newSection = { type, data: {} };
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
        setSections([...sections, newSection]);
    };

    const removeSection = (index) => {
        setSections(sections.filter((_, i) => i !== index));
    };
    const updateSectionData = (index, key, value) => {
        const updatedSections = sections.map((section, i) => {
            if (i === index) {
                const updatedData = { ...section.data };
                if (key === 'pdf' && value) {
                    updatedData[key] = { name: value.name, file: value };
                } else {
                    updatedData[key] = value;
                }
                return { ...section, data: updatedData };
            }
            return section;
        });
        setSections(updatedSections);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(title, sections);
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
            </Box>
            <SectionList
                sections={sections}
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
