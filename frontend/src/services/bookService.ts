import axios from 'axios';
import { Book } from '../types/Book';

// Get the current hostname from the browser
const currentHost = window.location.hostname;
// If we're in GitHub Codespaces, use the proper backend URL
const backendPort = '5000';
const API_URL = currentHost.includes('.app.github.dev') 
    ? `https://${currentHost.replace('3000', backendPort)}/api`
    : 'http://localhost:5000/api';

export const bookService = {
    // Get all books with optional search/filter
    getBooks: async (search?: string, genre?: string, author?: string) => {
        const params = new URLSearchParams();
        if (search) params.append('search', search);
        if (genre) params.append('genre', genre);
        if (author) params.append('author', author);
        
        const response = await axios.get(`${API_URL}/books?${params}`);
        return response.data;
    },

    // Get unique genres
    getGenres: async () => {
        const response = await axios.get(`${API_URL}/books/genres`);
        return response.data;
    },

    // Get unique authors
    getAuthors: async () => {
        const response = await axios.get(`${API_URL}/books/authors`);
        return response.data;
    },

    // Add a new book
    addBook: async (book: Omit<Book, '_id' | 'createdAt'>) => {
        const response = await axios.post(`${API_URL}/books`, book);
        return response.data;
    },

    // Update a book
    updateBook: async (id: string, book: Partial<Book>) => {
        const response = await axios.put(`${API_URL}/books/${id}`, book);
        return response.data;
    },

    // Delete a book
    deleteBook: async (id: string) => {
        const response = await axios.delete(`${API_URL}/books/${id}`);
        return response.data;
    }
};