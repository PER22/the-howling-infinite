import React from 'react';
import { TextField, Box, IconButton, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function SectionForm({ section, index, updateSectionData, removeSection }) {
    return (
        <Box key={index} marginBottom={2} display="flex" alignItems="center">
            {section.type === 'Chapter' && (
                <>
                    <TextField
                        label="Chapter Number"
                        value={section.data.number || ''}
                        onChange={(e) => updateSectionData(index, 'number', e.target.value)}
                        style={{ marginRight: 8 }}
                    />
                    <TextField
                        label="Chapter Title"
                        value={section.data.title || ''}
                        onChange={(e) => updateSectionData(index, 'title', e.target.value)}
                        style={{ marginRight: 8 }}
                    />
                    <input
                        accept="application/pdf"
                        style={{ display: 'none' }}
                        id={`file-input-${index}`}
                        type="file"
                        onChange={(e) => updateSectionData(index, 'pdf', e.target.files[0])}
                    />
                    <label htmlFor={`file-input-${index}`}>
                        <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                            Upload PDF
                        </Button>
                    </label>
                    <Typography variant="subtitle1" style={{ marginLeft: 8 }}>
                        {section.data.pdf?.name || 'No file chosen'}
                    </Typography>
                </>
            )}
            {section.type === 'Interlude' && (<>
                <TextField
                    label="Interlude Title"
                    value={section.data.title || ''}
                    onChange={(e) => updateSectionData(index, 'title', e.target.value)}
                    style={{ marginRight: 8 }}
                />
                <TextField
                    fullWidth
                    label="YouTube Link"
                    value={section.data.youtubeLink || ''}
                    onChange={(e) => updateSectionData(index, 'youtubeLink', e.target.value)}
                    style={{ marginRight: 8 }}
                />
                </>)}
            <IconButton onClick={() => removeSection(index)} color="error">
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}

export default SectionForm;
