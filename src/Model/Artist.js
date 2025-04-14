const mongoose = require('mongoose');

const ArtistSchema = new mongoose.Schema({
    avatar: { type: String, require: true },
    nameArtist: { type: String, require: true },
    song: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Song' }],
    albums: [
        {
            type: mongoose.Schema.Types.ObjectId, ref: 'Albums'
        }
    ],
    descriptionArtist: { type: String },
}, { timestamps: true });

const Artist = mongoose.model('Artist', ArtistSchema);

module.exports = Artist 