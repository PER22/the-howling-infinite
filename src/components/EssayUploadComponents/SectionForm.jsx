import React from 'react';
import { Box, IconButton, TextField, Typography, Button } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DragHandleIcon from '@mui/icons-material/DragHandle'; // Icon for drag handle
import { useSortable } from '@dnd-kit/sortable';
import { restrictToVerticalAxis, restrictToWindowEdges } from '@dnd-kit/modifiers';

import { CSS } from '@dnd-kit/utilities';
import './SectionForm.css'

function SectionForm({ id, section, index, updateSectionData, removeSection }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <Box className="section-form-container" key={index} marginBottom={2} display="flex" alignItems="center" ref={setNodeRef} style={style} modifiers={[restrictToVerticalAxis, restrictToWindowEdges]}>
            <IconButton {...attributes} {...listeners} style={{ marginRight: 8 }}>
                <DragHandleIcon />
            </IconButton>
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
                        {section.data.pdf?.name || section.data.pdfS3Key || 'No file chosen'}
                    </Typography>
                </>
            )}
            {section.type === 'Interlude' && (
                <>
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
                </>
            )}
            <IconButton onClick={() => removeSection(index)} color="error">
                <DeleteIcon />
            </IconButton>
        </Box>
    );
}

export default SectionForm;
