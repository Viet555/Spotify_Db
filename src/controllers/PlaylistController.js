const { createPlaylistService, getAllPlaylistService, updatePlaylistService, deletePlaylistService } = require("../sevices/PlaylistService");

const createPlaylist = async (req, res) => {
    try {
        const result = await createPlaylistService(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ EC: -1, MES: 'Server error' });
    }
};
const getAllPlaylist = async (req, res) => {
    limit = req.query.limit
    page = req.query.page
    if (!limit) limit = 7
    try {
        const result = await getAllPlaylistService(limit, page);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ EC: -1, MES: 'Server error' });
    }
};
const updateAplaylist = async (req, res) => {
    try {
        const result = await updatePlaylistService(req.body);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ EC: -1, MES: 'Server error' });
    }
};
const deletePlaylist = async (req, res) => {
    let id = req.query.id
    try {
        const result = await deletePlaylistService(id);
        return res.status(200).json(result);
    } catch (e) {
        console.log(e);
        return res.status(400).json({ EC: -1, MES: 'Server error' });
    }
};
module.exports = { createPlaylist, getAllPlaylist, updateAplaylist, deletePlaylist }