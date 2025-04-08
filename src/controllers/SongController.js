const { CreateSongService } = require("../sevices/SongService");


const CreateSong = async (req, res) => {
    try {
        const result = await CreateSongService(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ EC: -1, MES: 'Server error' });
    }
};

module.exports = {
    CreateSong
};
