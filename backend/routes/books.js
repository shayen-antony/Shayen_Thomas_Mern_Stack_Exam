const express = require('express');
const router = express.Router();
const Book = require('../models/Book');

// Get all books with optional search/filter
router.get('/', async (req, res) => {
    try {
        const { search, genre, author } = req.query;
        let query = {};

        if (search) {
            query = { $text: { $search: search } };
        }
        if (genre) {
            query.genre = genre;
        }
        if (author) {
            query.author = author;
        }

        const books = await Book.find(query);
        const totalBooks = await Book.countDocuments();
        const outOfStock = await Book.countDocuments({ stock: 0 });

        res.json({
            books,
            meta: {
                total: totalBooks,
                outOfStock
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add a new book
router.post('/', async (req, res) => {
    const book = new Book(req.body);
    try {
        const newBook = await book.save();
        res.status(201).json(newBook);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a book
router.put('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a book
router.delete('/:id', async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get unique genres (for filter dropdown)
router.get('/genres', async (req, res) => {
    try {
        const genres = await Book.distinct('genre');
        res.json(genres);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get unique authors (for filter dropdown)
router.get('/authors', async (req, res) => {
    try {
        const authors = await Book.distinct('author');
        res.json(authors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;