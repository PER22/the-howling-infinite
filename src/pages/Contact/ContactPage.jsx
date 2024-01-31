import { useState, useEffect, useContext } from "react";
import { Button, TextField, Typography, Box, FormControl, IconButton } from '@mui/material';
import { TitleContext } from "../../components/TitleBar/TitleContext";
import './ContactPage.css'
export default function ContactPage() {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Contact Information');
    }, [setTitle]);
    return (
        <div className="contact-info">
            <p>If you would like to, you may email me regarding these works at <em>OswaldPortrait@gmail.com</em>, or send me an email from this form. Your account information will be attached to it.</p>
        </div>
    );
}