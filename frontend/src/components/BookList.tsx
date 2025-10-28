import React, { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Box,
    Typography,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Book } from '../types/Book';

interface BookListProps {
    books: Book[];
    genres: string[];
    authors: string[];
    totalBooks: number;
    outOfStock: number;
    onEdit: (book: Book) => void;
    onDelete: (book: Book) => void;
    onSearch: (search: string) => void;
    onFilterGenre: (genre: string) => void;
    onFilterAuthor: (author: string) => void;
}

export const BookList: React.FC<BookListProps> = ({
    books,
    genres,
    authors,
    totalBooks,
    outOfStock,
    onEdit,
    onDelete,
    onSearch,
    onFilterGenre,
    onFilterAuthor
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
        onSearch(event.target.value);
    };

    const handleGenreChange = (event: any) => {
        setSelectedGenre(event.target.value);
        onFilterGenre(event.target.value);
    };

    const handleAuthorChange = (event: any) => {
        setSelectedAuthor(event.target.value);
        onFilterAuthor(event.target.value);
    };

    return (
        <Box>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" component="div" gutterBottom>
                    Book Inventory Stats
                </Typography>
                <Typography color="text.secondary">
                    Total Books: {totalBooks} | Out of Stock: {outOfStock}
                </Typography>
            </Box>

            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                <TextField
                    label="Search books"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearch}
                    size="small"
                    sx={{ width: 200 }}
                />
                <FormControl size="small" sx={{ width: 150 }}>
                    <InputLabel>Filter by Genre</InputLabel>
                    <Select
                        value={selectedGenre}
                        label="Filter by Genre"
                        onChange={handleGenreChange}
                    >
                        <MenuItem value="">All Genres</MenuItem>
                        {genres.map((genre) => (
                            <MenuItem key={genre} value={genre}>
                                {genre}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControl size="small" sx={{ width: 150 }}>
                    <InputLabel>Filter by Author</InputLabel>
                    <Select
                        value={selectedAuthor}
                        label="Filter by Author"
                        onChange={handleAuthorChange}
                    >
                        <MenuItem value="">All Authors</MenuItem>
                        {authors.map((author) => (
                            <MenuItem key={author} value={author}>
                                {author}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Author</TableCell>
                            <TableCell>Genre</TableCell>
                            <TableCell>Price</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Published Year</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {books.map((book) => (
                            <TableRow
                                key={book._id}
                                sx={{
                                    backgroundColor: book.stock === 0 ? '#ffebee' : 'inherit'
                                }}
                            >
                                <TableCell>{book.title}</TableCell>
                                <TableCell>{book.author}</TableCell>
                                <TableCell>{book.genre}</TableCell>
                                <TableCell>
                                    {`₹${book.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
                                </TableCell>
                                <TableCell>{book.stock}</TableCell>
                                <TableCell>{book.publishedYear}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => onEdit(book)}
                                        size="small"
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => onDelete(book)}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};