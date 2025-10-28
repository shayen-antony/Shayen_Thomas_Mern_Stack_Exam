import React, { useState, useEffect } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Typography
} from '@mui/material';
import { Book } from '../types/Book';
import { bookService } from '../services/bookService';
import { toast } from 'react-toastify';

interface EditBookModalProps {
    open: boolean;
    book: Book | null;
    onClose: () => void;
    onBookUpdated: () => void;
}

export const EditBookModal: React.FC<EditBookModalProps> = ({ 
    open, 
    book, 
    onClose, 
    onBookUpdated 
}) => {
    const [formData, setFormData] = useState<Partial<Book>>({});

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                genre: book.genre,
                price: book.price,
                stock: book.stock,
                publishedYear: book.publishedYear
            });
        }
    }, [book]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!book) return;

        try {
            await bookService.updateBook(book._id, {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
                publishedYear: formData.publishedYear ? Number(formData.publishedYear) : undefined
            });
            toast.success('Book updated successfully!');
            onBookUpdated();
            onClose();
        } catch (error) {
            toast.error('Error updating book');
            console.error('Error updating book:', error);
        }
    };

    if (!book) return null;

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="sm" 
            fullWidth
            PaperProps={{
                sx: { borderRadius: 2, p: 2 }
            }}
        >
            <DialogTitle>
                <Typography variant="h5" component="div" sx={{ fontWeight: 600 }}>
                    Edit Book
                </Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            required
                            fullWidth
                            label="Title"
                            name="title"
                            value={formData.title || ''}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            required
                            fullWidth
                            label="Author"
                            name="author"
                            value={formData.author || ''}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <TextField
                            required
                            fullWidth
                            label="Genre"
                            name="genre"
                            value={formData.genre || ''}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 2
                        }}>
                            <TextField
                                required
                                fullWidth
                                label="Price"
                                name="price"
                                type="number"
                                value={formData.price || ''}
                                onChange={handleChange}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <Typography variant="body2">$</Typography>
                                }}
                            />
                            <TextField
                                required
                                fullWidth
                                label="Stock"
                                name="stock"
                                type="number"
                                value={formData.stock || ''}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Box>
                        <TextField
                            fullWidth
                            label="Published Year"
                            name="publishedYear"
                            type="number"
                            value={formData.publishedYear || ''}
                            onChange={handleChange}
                            variant="outlined"
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ padding: 3, pt: 0 }}>
                    <Button 
                        onClick={onClose}
                        variant="outlined"
                        sx={{ mr: 1 }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        Save Changes
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};