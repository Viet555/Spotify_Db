const { CreateSongService, getAllSongService, updateSongService, deleteSongService } = require("../sevices/SongService");


const CreateSong = async (req, res) => {
    try {
        const result = await CreateSongService(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ EC: -1, MES: 'Server error' });
    }
};
const getAllsongs = async (req, res) => {
    limit = req.query.limit,
        page = req.query.page
    if (!limit) limit = '6'
    try {
        let data = await getAllSongService(limit, page)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}
const updateASong = async (req, res) => {

    try {
        let data = await updateSongService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}
const deleteSong = async (req, res) => {
    let id = req.query.id
    try {
        let data = await deleteSongService(id)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}
module.exports = {
    CreateSong, getAllsongs, updateASong, deleteSong
};
