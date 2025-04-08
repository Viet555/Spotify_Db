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

module.exports = {
    CreateSongService
};
