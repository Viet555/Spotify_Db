const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    image: { type: String, require: true },
    artist: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'artist', require: true
        },
    ],
    album: { type: mongoose.Schema.Types.ObjectId, ref: 'Albums', default: null },
    nameSong: { type: String, require: true },
    genre: [{ type: String }],                             // Thể loại (Pop, Ballad, EDM,...)
    view: { type: Number, default: 0 },
    releaseDate: { type: Date },                           // Ngày phát hành
    duration: { type: Number, },
    isPublic: { type: Boolean, default: true },            // Có được công khai hay không
    lyrics: { type: String },
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

module.exports = Song 