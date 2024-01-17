import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import SectionList from './SectionList';
import { v4 as uuidv4 } from 'uuid';

function EssayForm({ essayExists, initialTitle, initialSections, onSubmit}) {
    const [title, setTitle] = useState(initialTitle || '');
    const [sections, setSections] = useState(initialSections || []);

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
                    newSection:true
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
        setSections(sections =>sections.filter((_, i) => i !== index));
    };

    const updateSectionData = (index, key, value) => {
        console.log("UpdateSectionDataCalled");
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
