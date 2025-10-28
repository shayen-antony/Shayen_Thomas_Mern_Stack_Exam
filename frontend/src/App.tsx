import React, { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Button,
    AppBar,
    Toolbar,
    Typography,
    IconButton
} from '@mui/material';
import { Add as AddIcon, Brightness4, Brightness7 } from '@mui/icons-material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { BookList } from './components/BookList';
import { AddBookForm } from './components/AddBookForm';
import { EditBookModal } from './components/EditBookModal';
import { DeleteConfirmationPopup } from './components/DeleteConfirmationPopup';
import { Book } from './types/Book';
import { bookService } from './services/bookService';
import { ThemeContextProvider, useTheme } from './context/ThemeContext';

const AppContent = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [genres, setGenres] = useState<string[]>([]);
    const [authors, setAuthors] = useState<string[]>([]);
    const [totalBooks, setTotalBooks] = useState(0);
    const [outOfStock, setOutOfStock] = useState(0);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editBook, setEditBook] = useState<Book | null>(null);
    const [deleteBook, setDeleteBook] = useState<Book | null>(null);
    const { darkMode, toggleDarkMode } = useTheme();

    const fetchBooks = async (search?: string, genre?: string, author?: string) => {
        try {
            const response = await bookService.getBooks(search, genre, author);
            // Backend may return either { books, meta } or an array of books.
            if (Array.isArray(response)) {
                setBooks(response);
                setTotalBooks(response.length);
                setOutOfStock(response.filter((b: any) => b.stock === 0).length);
            } else if (response && response.books) {
                setBooks(response.books);
                setTotalBooks(response.meta?.total ?? response.books.length);
                setOutOfStock(response.meta?.outOfStock ?? response.books.filter((b: any) => b.stock === 0).length);
            } else {
                // Fallback: empty
                setBooks([]);
                setTotalBooks(0);
                setOutOfStock(0);
            }
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    const fetchFilters = async () => {
        try {
            const [genresData, authorsData] = await Promise.all([
                bookService.getGenres(),
                bookService.getAuthors()
            ]);
            setGenres(genresData);
            setAuthors(authorsData);
        } catch (error) {
            console.error('Error fetching filters:', error);
        }
    };

    useEffect(() => {
        fetchBooks();
        fetchFilters();
    }, []);

    return (
        <>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Shayen's Mern Stack Bookstore
                    </Typography>
                    <IconButton color="inherit" onClick={toggleDarkMode}>
                        {darkMode ? <Brightness7 /> : <Brightness4 />}
                    </IconButton>
                </Toolbar>
            </AppBar>

            <Container maxWidth="lg" sx={{ mt: 4 }}>
                <Box sx={{ mb: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Add New Book
                    </Button>
                </Box>

                <BookList
                    books={books}
                    genres={genres}
                    authors={authors}
                    totalBooks={totalBooks}
                    outOfStock={outOfStock}
                    onEdit={setEditBook}
                    onDelete={setDeleteBook}
                    onSearch={(search) => fetchBooks(search)}
                    onFilterGenre={(genre) => fetchBooks(undefined, genre)}
                    onFilterAuthor={(author) => fetchBooks(undefined, undefined, author)}
                />

                <AddBookForm
                    open={isAddModalOpen}
                    onClose={() => setIsAddModalOpen(false)}
                    onBookAdded={() => {
                        fetchBooks();
                        fetchFilters();
                    }}
                />

                <EditBookModal
                    open={!!editBook}
                    book={editBook}
                    onClose={() => setEditBook(null)}
                    onBookUpdated={() => {
                        fetchBooks();
                        fetchFilters();
                    }}
                />

                <DeleteConfirmationPopup
                    open={!!deleteBook}
                    book={deleteBook}
                    onClose={() => setDeleteBook(null)}
                    onConfirm={async () => {
                        if (deleteBook) {
                            await bookService.deleteBook(deleteBook._id);
                            setDeleteBook(null);
                            fetchBooks();
                            fetchFilters();
                        }
                    }}
                />

                <ToastContainer position="bottom-right" />
            </Container>
        </>
    );
};

const App = () => {
    return (
        <ThemeContextProvider>
            <AppContent />
        </ThemeContextProvider>
    );
};

export default App;
