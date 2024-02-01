import React from 'react';
import { useState, useEffect, useContext } from "react";
import { useLocation } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { Card, CardContent } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import { TitleContext } from "../../../components/TitleBar/TitleContext";
import { resetPassword } from "../../../utilities/users-api";
import FeedbackMessage from "../../../components/FeedbackMessage/FeedbackMessage";




function useQuery() {
    return new URLSearchParams(useLocation().search);
}
    
export default function PerformPasswordResetPage() {
    const { setTitle } = useContext(TitleContext);
    useEffect(() => {
        setTitle('Enter New Password');
    }, [setTitle]);

    let query = useQuery();
    useEffect(() => {
        setToken(query.get('token'));
    }, [query]);

    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handlePasswordReset = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          return;
        }
        try{
            const response = await resetPassword(token,password);
            if(response){
                setMessage("Password reset successfully.");
            }
        }catch(err){
            setError(err.message);
        }
    }

    return (
        <>
        <Card className="info-card">
        <CardContent>
      <form onSubmit={handlePasswordReset}>
        <FormControl fullWidth margin="normal">
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            variant="outlined"
          />
        </FormControl>

        <FormControl fullWidth margin="normal">
          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            variant="outlined"
          />
        </FormControl>

        <Button type="submit" variant="contained" color="primary">
          Reset Password
        </Button>
      </form>
      </CardContent>
      </Card>
      <FeedbackMessage error={error} message={message}/>
    </>
      );
}