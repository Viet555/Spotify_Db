const connection = require('../config/ConfigDataBase');
const path = require('path');
const fs = require('fs');
const uploadDir = path.join(__dirname, '../uploads');
const CreateSongService = (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const { nameSong, artist, album, genre, lyrics, releaseDate, duration, isPublic, image, audio } = data;

            if (!nameSong || !audio) {
                return resolve({
                    EC: -1,
                    MES: 'Missing song name, artist or audio file'
                });
            }
            // Xử lý base64 và lưu file mp3
            const base64Data = audio.replace(/^data:audio\/\w+;base64,/, ''); // bỏ phần đầu 
            const buffer = Buffer.from(base64Data, 'base64'); // chuyển base 64 thành buffer (base64) là định dạng đầu vào 
            const audioFileName = `${Date.now()}_${nameSong.replace(/\s+/g, '_')}.mp3`; // 
            const audioFilePath = path.join(uploadDir, audioFileName);//Ghép đường dẫn thư mục + tên file thành đường dẫn tuyệt đối tới file audio

            fs.writeFileSync(audioFilePath, buffer);

            const newSong = await connection.Song.create({
                nameSong,
                artist: Array.isArray(artist) ? artist : [artist],
                album: album || null,
                genre: genre ? (Array.isArray(genre) ? genre : [genre]) : [],
                lyrics: lyrics || '',
                releaseDate: releaseDate || null,
                duration: duration || null,
                isPublic: isPublic !== undefined ? isPublic : true,
                audio: `/uploads/${audioFileName}`,
                image
            });

            resolve({
                EC: 0,
                MES: 'Create song successfully',
                data: newSong
            });
        } catch (e) {
            reject(e);
        }
    });
};
//
const getAllSongService = async (limit, page) => {
    try {
        if (!limit || !page) {
            let song = await connection.Song.find()
            return ({
                EC: 0,
                MES: 'get all song success',
                song
            })
        } else {
            let totalSongs = await connection.Song.countDocuments()
            let totalPages = Math.ceil(totalSongs / limit)
            let Song = await connection.Song.find()
                .skip((page - 1) * limit)
                .sort({ createdAt: -1 })
                .limit(limit)
                .populate('artist', 'nameArtist')
                .exec();

            return ({
                EC: 0,
                MES: 'get All Song Table Success',
                data: Song,
                totalPages: totalPages,
                currentPage: page
            }
            )
        }
    } catch (e) {
        console.log(e)
        return {
            EC: -2,
            MES: "Server error while updating song",
        };
    }
}
//
const updateSongService = async (dataSong) => {
    try {
        const { _id, nameSong, artist, album, genre, lyrics, releaseDate, duration, isPublic, image, audio } = dataSong;

        if (!_id) {
            return {
                EC: -1,
                MES: "id not found"
            };
        }

        const song = await connection.Song.findById(_id);
        if (!song) {
            return {
                EC: 2,
                MES: 'Song not found'
            };
        }

        let updatedAudioPath = song.audio;

        if (audio?.startsWith('data:audio')) {
            const base64Data = audio.replace(/^data:audio\/\w+;base64,/, '');
            const buffer = Buffer.from(base64Data, 'base64');
            const audioFileName = `${Date.now()}_${nameSong.replace(/\s+/g, '_')}.mp3`;
            const audioFilePath = path.join(uploadDir, audioFileName);
            fs.writeFileSync(audioFilePath, buffer);
            updatedAudioPath = `/uploads/${audioFileName}`;
        }

        const SongEdit = await connection.Song.findByIdAndUpdate(
            _id,
            {
                nameSong,
                artist: Array.isArray(artist) ? artist : [artist],
                album: album || null,
                genre,
                lyrics: lyrics || '',
                releaseDate: releaseDate || null,
                duration: duration || null,
                isPublic: isPublic !== undefined ? isPublic : true,
                audio: updatedAudioPath,
                image
            },
            { new: true }
        );

        return {
            EC: 0,
            MES: 'Update song success',
            data: SongEdit
        };
    } catch (e) {
        console.error('UpdateSongService Error:', e);
        return {
            EC: -2,
            MES: 'Internal server error',
        };
    }
};
//
const deleteSongService = async (songId) => {
    try {
        if (!songId) {
            return ({
                EC: -1,
                MES: 'Missing Id Song',
            })
        }
        else {
            let Song = await connection.Song.findByIdAndDelete(songId)
            if (Song?.audio) {
                const fileName = path.basename(Song.audio);
                const audioPath = path.join(uploadDir, fileName);

                if (fs.existsSync(audioPath)) {
                    fs.unlinkSync(audioPath); // Xóa file audio
                }
            }
            if (!Song) {
                return ({
                    EC: -1,
                    MES: 'Song not foul',
                })
            }
            return ({
                EC: 0,
                MES: 'Delete song success ',
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
module.exports = {
    CreateSongService, getAllSongService, updateSongService, deleteSongService
};
