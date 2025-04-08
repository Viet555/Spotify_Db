const mongoose = require('mongoose');
const User = require('./User');

const LibrarySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    favoriteSongId: { type: mongoose.Schema.Types.ObjectId, ref: 'FavoriteSong', require: true },
    playlist: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Playlist', require: true
    }],
}, { timestamps: true });

const Library = mongoose.model('Library', LibrarySchema);

module.exports = Library 