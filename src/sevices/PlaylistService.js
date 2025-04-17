const connection = require("../config/ConfigDataBase");

const createPlaylistService = async (data) => {
    try {
        const { namePlaylist, note, image, user, song, isPublic } = data;

        if (!namePlaylist || !image || !user) {
            return {
                EC: -1,
                MES: "Missing required fields"
            };
        }

        const totalSong = Array.isArray(song) ? song.length : 0

        const newPlaylist = await connection.Playlist.create({
            namePlaylist,
            note,
            image,
            user,
            song,
            isPublic,
            totalSong
        });

        return {
            EC: 0,
            MES: "Create playlist success",
            data: newPlaylist
        };
    } catch (e) {
        console.error(e);
        return {
            EC: -2,
            MES: "Server error"
        };
    }
};
const getAllPlaylistService = async (limit, page) => {
    try {
        if (!limit || !page) {
            let playlist = await connection.Playlist.find().populate('song')
            return ({
                EC: 0,
                MES: 'Get all playlist sucess',
                playlist
            })
        }
        else {

            let totalPlaylist = await connection.Playlist.countDocuments()
            let totalPages = Math.ceil(totalPlaylist / limit)
            let playlist = await connection.Playlist.find()
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .populate('song')
                .limit(limit)

            return ({
                EC: 0,
                MES: 'get All playlist Table Success',
                data: playlist,
                totalPages: totalPages,
                currentPage: page
            })
        }
    } catch (e) {
        console.log(e)
        return ({
            EC: -2,
            MES: 'Internal server error',
        })
    }
}
const updatePlaylistService = async (dataEdit) => {
    try {
        const { _id, namePlaylist, note, image, user, song, isPublic } = dataEdit;

        if (!_id) {
            return {
                EC: -1,
                MES: 'Missing playlist ID'
            };
        }

        const existingPlaylist = await connection.Playlist.findById(_id);
        if (!existingPlaylist) {
            return {
                EC: 1,
                MES: 'Playlist not found'
            };
        }

        const totalSong = Array.isArray(song) ? song.length : 0;

        const updatedPlaylist = await connection.Playlist.findByIdAndUpdate(
            _id,
            {
                namePlaylist: namePlaylist || existingPlaylist.namePlaylist,
                note: note || existingPlaylist.note,
                image: image || existingPlaylist.image,
                user: user || existingPlaylist.user,
                song: Array.isArray(song) ? song : existingPlaylist.song,
                isPublic: isPublic || existingPlaylist.isPublic,
                totalSong
            },
            { new: true }
        );

        return {
            EC: 0,
            MES: 'Update playlist success',
            data: updatedPlaylist
        };
    } catch (e) {
        console.error(e);
        return {
            EC: -2,
            MES: 'Internal server error',
        };
    }
};
const deletePlaylistService = async (id) => {
    try {
        if (!id) {
            return ({
                EC: -1,
                MES: "you have not passed the id"
            })
        } else {
            const playlist = await connection.Playlist.findByIdAndDelete(id);

            if (!playlist) {
                return {
                    EC: 1,
                    MES: "Playlist not found"
                };
            }

            return {
                EC: 0,
                MES: "Delete playlist success"
            };
        }
    } catch (e) {
        console.log(e)
        return {
            EC: -2,
            MES: 'Internal server error',
        };
    }
}
module.exports = { createPlaylistService, getAllPlaylistService, updatePlaylistService, deletePlaylistService }