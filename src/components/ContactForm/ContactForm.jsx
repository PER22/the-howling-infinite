import React, { useState, useEffect } from 'react';
import { Button, TextField, Typography, Box, FormControl, IconButton } from '@mui/material';
import FeedbackMessage from '../FeedbackMessage/FeedbackMessage';
import { postMessage } from '../../utilities/contact-service';


function ContactForm() {
    const [text, setText] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await postMessage({text});
                setMessage("Email sent successfully! Thanks for reaching out.");
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <Box className={"contact-form"} component="div">
                <FormControl component="form" onSubmit={handleSubmit} sx={{ mt: 2, width: '40rem' }}>
                    <TextField
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Write your message here..."
                        multiline
                        rows={5}
                        variant="outlined"
                        fullWidth
                        sx={{ backgroundColor: "white", borderRadius: '4px' }}
                    />
                    <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                        Send Email
                    </Button>
                </FormControl>
            </Box>
            <FeedbackMessage error={error} message={message} />
        </>
    );
}

export default ContactForm;
