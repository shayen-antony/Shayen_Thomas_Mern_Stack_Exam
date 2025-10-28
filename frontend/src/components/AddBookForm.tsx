import React, { useState } from 'react';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Typography,
    Box
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Book } from '../types/Book';
import { bookService } from '../services/bookService';
import { toast } from 'react-toastify';

const StyledTextField = styled(TextField)(({ theme }) => ({
    width: '100%',
    marginBottom: theme.spacing(2)
}));

interface AddBookFormProps {
    open: boolean;
    onClose: () => void;
    onBookAdded: () => void;
}

export const AddBookForm: React.FC<AddBookFormProps> = ({ open, onClose, onBookAdded }) => {
    const [book, setBook] = useState({
        title: '',
        author: '',
        genre: '',
        price: '',
        stock: '',
        publishedYear: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBook({
            ...book,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await bookService.addBook({
                ...book,
                price: Number(book.price),
                stock: Number(book.stock),
                publishedYear: book.publishedYear ? Number(book.publishedYear) : undefined
            });
            toast.success('Book added successfully!');
            onBookAdded();
            onClose();
            setBook({ title: '', author: '', genre: '', price: '', stock: '', publishedYear: '' });
        } catch (error) {
            toast.error('Error adding book');
            console.error('Error adding book:', error);
        }
    };

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
                    Add New Book
                </Typography>
            </DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <StyledTextField
                            required
                            label="Title"
                            name="title"
                            value={book.title}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <StyledTextField
                            required
                            label="Author"
                            name="author"
                            value={book.author}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <StyledTextField
                            required
                            label="Genre"
                            name="genre"
                            value={book.genre}
                            onChange={handleChange}
                            variant="outlined"
                        />
                        <Box sx={{ 
                            display: 'grid', 
                            gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                            gap: 2
                        }}>
                            <StyledTextField
                                required
                                label="Price"
                                name="price"
                                type="number"
                                value={book.price}
                                onChange={handleChange}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: <Typography variant="body2">$</Typography>
                                }}
                            />
                            <StyledTextField
                                required
                                label="Stock"
                                name="stock"
                                type="number"
                                value={book.stock}
                                onChange={handleChange}
                                variant="outlined"
                            />
                        </Box>
                        <StyledTextField
                            label="Published Year"
                            name="publishedYear"
                            type="number"
                            value={book.publishedYear}
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
                        Add Book
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};