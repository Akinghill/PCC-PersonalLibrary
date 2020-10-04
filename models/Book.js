const mongoose = require('mongoose');

// Schema object template connected to database
const BookSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    comments: [],
    timestamp: {
        type: Date,
        default: Date.now()
    }
});

// exports template as constructor 'Book'
module.exports = mongoose.model('Book', BookSchema);