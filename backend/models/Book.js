const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: true 
    },
    author: { 
        type: String, 
        required: true 
    },
    genre: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true,
        min: [0, 'Price cannot be negative']
    },
    stock: { 
        type: Number, 
        default: 0,
        min: [0, 'Stock cannot be negative']
    },
    publishedYear: { 
        type: Number,
        validate: {
            validator: function (v) {
                if (v == null) return true;
                const year = new Date().getFullYear();
                return Number.isInteger(v) && v >= 0 && v <= year;
            },
            message: props => `${props.value} is not a valid publication year`
        }
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// Add indexes for search functionality
bookSchema.index({ title: 'text', author: 'text', genre: 'text' });

module.exports = mongoose.model('Book', bookSchema);