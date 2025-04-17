const mongoose = require('mongoose');

const PlayListSchema = new mongoose.Schema({
    namePlaylist: { type: String, require: true },
    note: { type: String, },
    image: { type: String, require: true },
    totalSong: { type: String },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    song: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Song', require: true
    }],
    isPublic: { type: Boolean, default: true },
    views: { type: Number, default: 0 },
}, { timestamps: true });

const Playlist = mongoose.model('Playlist', PlayListSchema);

module.exports = Playlist 