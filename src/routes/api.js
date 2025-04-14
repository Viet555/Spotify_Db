const express = require('express')

const { CreateNewProduct, getProductBytype, deleteAproduct, updateProduct, getDataType, createBanner, updateBanner,
    getAllBanner, Deletebanner, fetchAllProductByType } = require('../controllers/delete1')
const { authMiddleware, authorize } = require('../Middleware/JWTAction')
const { CreateSong } = require('../controllers/SongController')
const { getUpload } = require('../config/Gridfs')

//** 
const { getAllUser, handleCreateArtist, getAllArtist, UpdateArtist, deleteArtist } = require('../controllers/Admincontroller',)
const { CreateUser, handleLogin, deleteUser, UpdateUser, handleRefreshToken, getSelectArtist } = require('../controllers/UserController')
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
//product
Router.post('/api/Create-product', authMiddleware, authorize(['Admin']), CreateNewProduct)
Router.get('/api/getAllproductByType', getProductBytype)
Router.delete('/api/deleteAProduct', authMiddleware, authorize(['Admin']), deleteAproduct)
Router.put('/api/Update-Product', authMiddleware, authorize(['Admin']), updateProduct)
//banner
Router.get('/api/Get-dataType-product', getDataType)
Router.post('/api/Create-banner', authMiddleware, authorize(['Admin']), createBanner)
Router.put('/api/update-banner', authMiddleware, authorize(['Admin']), updateBanner)
Router.get('/api/fetch-all-banner', getAllBanner)
Router.delete('/api/Delete-banner', authMiddleware, authorize(['Admin']), Deletebanner)

Router.get('/fetchAllProduct-byType', fetchAllProductByType)



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
Router.post('/create-song', CreateSong);
module.exports = Router