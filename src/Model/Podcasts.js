const mongoose = require('mongoose');

const PodcastSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    image: { type: String },
    episodes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Episode',
        required: true
    }],
    category: { type: String },
    isPublic: { type: Boolean, default: true },
}, { timestamps: true });

const Podcast = mongoose.model('Podcast', PodcastSchema);

module.exports = Podcast;