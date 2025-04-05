const mongoose = require('mongoose');

const AlbumsSchema = new mongoose.Schema({
    nameAlbum: { type: String, require: true },
    song: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Song', require: true,
    }],
    imageAlbum: { type: String, },
    totalSong: { type: Number, default: 0 },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'Artist', required: true },
    releaseDate: { type: Date },
    views: { type: Number, default: 0 },
}, { timestamps: true });

const Albums = mongoose.model('Albums', AlbumsSchema);

module.exports = Albums 