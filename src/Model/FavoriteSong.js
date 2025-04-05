const mongoose = require('mongoose');
const User = require('./User');

const favoriteSongSchema = new mongoose.Schema({

    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    song: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Song', require: true,
    }],
    totalSong: { type: String, default: 0 }
}, { timestamps: true });

const FavoriteSong = mongoose.model('FavoriteSong', favoriteSongSchema);

module.exports = FavoriteSong 