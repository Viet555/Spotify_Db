const express = require('express')
const { authMiddleware, authorize } = require('../Middleware/JWTAction')

const { getUpload } = require('../config/Gridfs')

//** 
const { CreateSong, getAllsongs, updateASong, deleteSong } = require('../controllers/SongController')
const { getAllUser, handleCreateArtist, getAllArtist, UpdateArtist, deleteArtist, } = require('../controllers/Admincontroller',)
const { CreateUser, handleLogin, deleteUser, UpdateUser, handleRefreshToken, getSelectArtist, } = require('../controllers/UserController')
const { createPlaylist, getAllPlaylist, updateAplaylist, deletePlaylist } = require('../controllers/PlaylistController')
const Router = express.Router()
//user
Router.put('/api/UpdateUser', UpdateUser)
Router.post('/api/CreateUSer', CreateUser)
Router.post('/api/LoginUser', handleLogin)

Router.get('/api/GetAllUser', getAllUser)
Router.put('/api/UpdateUser', authMiddleware, UpdateUser)
Router.delete('/api/DeleteUser', authMiddleware, authorize(['Admin']), deleteUser)

//ref Token
Router.post('/refresh-token', handleRefreshToken)
//Artist
Router.post('/api/Create-Artist', authMiddleware, authorize(['Admin']), handleCreateArtist)
Router.get('/api/get-all-Artist', authMiddleware, authorize(['Admin']), getAllArtist)
Router.put('/api/Update-a-Artist', authMiddleware, UpdateArtist)
Router.delete('/api/delete-a-Artist', authMiddleware, authorize(['Admin']), deleteArtist)
Router.get('/api/get-select-Artist', authMiddleware, getSelectArtist)
//Songs
Router.post('/api/create-song', CreateSong);
Router.get('/api/get-all-Songs', authMiddleware, authorize(['Admin']), getAllsongs)
Router.put('/api/update-a-song', authMiddleware, authorize(['Admin']), updateASong)
Router.delete('/api/delete-a-song', authMiddleware, authorize(['Admin']), deleteSong)
//playlist
Router.post('/api/create-playlist', createPlaylist);
Router.get('/api/get-all-playlist', authMiddleware, getAllPlaylist)
Router.put('/api/update-a-playlist', authMiddleware, updateAplaylist)
Router.delete('/api/delete-a-playlist', authMiddleware, deletePlaylist)

// API đọc file GridFS (MP3, ảnh)
// Router.get('/files/:id', async (req, res) => {
//     try {
//         if (!db) return res.status(503).json({ error: 'DB chưa sẵn sàng' });

//         const bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
//         const _id = new ObjectId(req.params.id);
//         const files = await db.collection('uploads.files').findOne({ _id });

//         if (!files) return res.status(404).json({ error: 'File not found' });

//         res.set('Content-Type', files.contentType);
//         bucket.openDownloadStream(_id).pipe(res);
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ error: 'Cannot retrieve file' });
//     }
// });
//const express = require('express');

// Dùng upload.fields nếu upload nhiều file

module.exports = Router