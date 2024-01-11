import React from 'react';
import { Button, Box } from '@mui/material';
import SectionForm from './SectionForm';

function SectionList({ sections, updateSectionData, removeSection, addSection }) {
    return (
        <Box>
            {sections.map((section, index) => (
                <SectionForm
                    key={index}
                    section={section}
                    index={index}
                    updateSectionData={updateSectionData}
                    removeSection={removeSection}
                />
            ))}
            <Button onClick={() => addSection('Chapter')}>Add Chapter</Button>
            <Button onClick={() => addSection('Interlude')}>Add Interlude</Button>
        </Box>
    );
}

export default SectionList;
