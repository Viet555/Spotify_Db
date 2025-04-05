const mongoose = require('mongoose');

const EpisodeSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    duration: { type: Number, required: true },
    image: { type: String },
    publishDate: { type: Date, default: Date.now },
    // Có thể chứa playlist hoặc bài hát riêng lẻ
    playlist: { type: mongoose.Schema.Types.ObjectId, ref: 'Playlist' },
    songs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Song'
    }],
    isPublic: { type: Boolean, default: true },
    playCount: { type: Number, default: 0 },
}, { timestamps: true });

const Episode = mongoose.model('Episode', EpisodeSchema);

module.exports = Episode;