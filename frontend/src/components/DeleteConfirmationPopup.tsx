import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Box,
    Typography,
    useTheme
} from '@mui/material';
import { Book } from '../types/Book';

interface DeleteConfirmationPopupProps {
    open: boolean;
    book: Book | null;
    onClose: () => void;
    onConfirm: () => void;
}

export const DeleteConfirmationPopup: React.FC<DeleteConfirmationPopupProps> = ({
    open,
    book,
    onClose,
    onConfirm
}) => {
    const theme = useTheme();

    if (!book) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="delete-dialog-title"
            aria-describedby="delete-dialog-description"
            PaperProps={{
                sx: { borderRadius: 2, p: 1 }
            }}
        >
            <DialogTitle id="delete-dialog-title">
                <Typography variant="h6" component="div">
                    Confirm Delete
                </Typography>
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" gutterBottom>
                        {book.title}
                    </Typography>
                    <Typography color="textSecondary">
                        by {book.author}
                    </Typography>
                </Box>
                <DialogContentText id="delete-dialog-description" sx={{ color: theme.palette.error.main }}>
                    Are you sure you want to delete this book? This action cannot be undone.
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                >
                    Cancel
                </Button>
                <Button 
                    onClick={onConfirm} 
                    color="error" 
                    variant="contained"
                    sx={{ ml: 1 }}
                >
                    Delete
                </Button>
            </DialogActions>
        </Dialog>
    );
};