const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true, },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, },
    roleId: { type: String, },
    image: { type: String, },
    phoneNumber: { type: String, },
    playList: [{ type: String, }],
    isPodcaster: { type: Boolean, default: false },
    libary: { type: mongoose.Schema.Types.ObjectId, ref: 'libary' },
    favoritesList: { type: mongoose.Schema.Types.ObjectId, ref: 'favoritesList' },
    isArtist: { type: Boolean, default: false }, // user này có phải nghệ sĩ k
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null }
});

const User = mongoose.model('User', userSchema);

module.exports = User 