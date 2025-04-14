const connection = require('../config/ConfigDataBase')
const handleGetAllUserPage = (limit, page) => {
    return new Promise(async (resolve, reject) => {
        if (!limit || !page) {
            resolve({
                EC: -1,
                MES: 'Missing input params'
            })
        }
        else {
            try {
                let totalUsers = await connection.User.countDocuments();
                let totalPages = Math.ceil(totalUsers / limit);
                let dataUsers = await connection.User.find()
                    .skip((page - 1) * limit) // Bỏ qua user của trang trước
                    .limit(limit)
                    .sort({ createdAt: -1 })
                    .select('-password');

                resolve({
                    EC: 0,
                    MES: 'fetch All Success',
                    data: dataUsers,
                    totalPages: totalPages, // Số trang tổng cộng
                    currentPage: page // Trang hiện tại
                }
                )
            } catch (e) {
                reject(e)
            }
        }

    })
}
//Create Artist
const CreateArtistService = async (dataArtist) => {
    try {
        if (!dataArtist.avatar || !dataArtist.nameArtist) {
            return ({
                EC: -1,
                MES: 'Missing input info Artist !!!!'
            })
        }
        else {
            // const slug = dataArtist.nameArtist
            //     .toLowerCase()
            //     .trim()
            //     .replace(/\s+/g, '-')
            //     .replace(/[^a-z0-9\-]/g, '');

            // const existingArtist = await connection.Artist.findOne({ slug });
            // if (existingArtist) {
            //     return {
            //         EC: 2,
            //         MES: 'Artist already exists!'
            //     };
            // }
            let artist = await connection.Artist.create({
                avatar: dataArtist.avatar,
                // slug: slug,
                nameArtist: dataArtist.nameArtist,
                descriptionArtist: dataArtist.descriptionArtist || ''
            })
            return ({
                EC: 0,
                MES: 'Create Artist Success',
            })
        }
    } catch (e) {
        console.log(e)
    }
}
//Get all Artist
const getAllArtistService = (limit, page) => {
    return new Promise(async (resolve, reject) => {
        if (!limit || !page) {
            let Artists = await connection.Artist.find()
            resolve({
                EC: 0,
                MES: 'get all artist Success',
                Artists
            })
        }
        else {
            try {
                let totalArtist = await connection.Artist.countDocuments();
                let totalPages = Math.ceil(totalArtist / limit);
                let dataArtist = await connection.Artist.find()
                    .skip((page - 1) * limit)
                    .sort({ createdAt: -1 })
                    .limit(limit)

                resolve({
                    EC: 0,
                    MES: 'get All Artist Table Success',
                    data: dataArtist,
                    totalPages: totalPages, // Số trang tổng cộng
                    currentPage: page // Trang hiện tại
                }
                )
            } catch (e) {
                reject(e)
            }
        }

    })
}
const updateArtistService = async (dataArtistEdit) => {

    try {
        if (!dataArtistEdit._id) {
            return ({
                EC: -1,
                MES: 'missing Id Artist Edit '
            })
        } else {
            let artistEdit = await connection.Artist.findByIdAndUpdate(
                { _id: dataArtistEdit._id },
                {
                    avatar: dataArtistEdit.avatar,
                    nameArtist: dataArtistEdit.nameArtist,
                    descriptionArtist: dataArtistEdit.descriptionArtist || '',
                }, { new: true }

            )
            if (!artistEdit) {
                return ({
                    EC: 2,
                    MES: 'Artist is not existing'
                })
            }

            return ({
                EC: 0,
                MES: 'Update Artist success'
            })

        }
    } catch (e) {
        console.log(e)
    }
}
//delete Artist
const DeleteArtistService = async (artistId) => {
    try {
        if (!artistId) {
            return ({
                EC: -1,
                MES: `missing artistId please provide  `
            })
        } else {
            let artist = await connection.Artist.findByIdAndDelete(artistId)
            if (!artist) {
                return ({
                    EC: 2,
                    MES: 'Artist not foud'
                })
            }
            return ({
                EC: 0,
                MES: 'Delete Artist Success '
            })
        }
    } catch (e) {
        console.log(e)
    }
}
module.exports = { handleGetAllUserPage, CreateArtistService, getAllArtistService, updateArtistService, DeleteArtistService }