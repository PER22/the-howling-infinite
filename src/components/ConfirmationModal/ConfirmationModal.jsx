import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';

export default function ConfirmationModal({ closeFunction, deleteFunction, confirmationText, contentId }) {

    const handleDelete = async (id) => {
        await deleteFunction(id);
    };

    return (
        <Dialog open={true} onClose={closeFunction}>
            <DialogTitle>Confirm Delete?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {confirmationText}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeFunction} color="primary">
                    Cancel
                </Button>
                <Button onClick={() => handleDelete(contentId)} color="secondary">
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
}
