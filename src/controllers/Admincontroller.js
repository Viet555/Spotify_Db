const { handleGetAllUserPage, CreateArtistService, getAllArtistService, updateArtistService, DeleteArtistService, } = require("../sevices/AdminService")

const getAllUser = async (req, res) => {
    let limit = req.query.limit
    let page = req.query.page

    if (!limit) limit = '6'

    try {

        let data = await handleGetAllUserPage(limit, page)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'ERR FROM SV'
        })
    }
}
const handleCreateArtist = async (req, res) => {
    try {
        let data = await CreateArtistService(req.body)
        res.status(200).json(data)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            EC: -1,
            MES: 'err from sv'
        })
    }
}
const getAllArtist = async (req, res) => {
    let limit = req.query.limit
    let page = req.query.page
    try {
        if (!limit) limit = '6'
        let dataArtist = await getAllArtistService(limit, page)
        res.status(200).json(dataArtist)
    } catch (e) {
        console.log(e)
        res.status(400).json({
            EC: -1,
            MES: 'err from sv'
        })
    }
}
const UpdateArtist = async (req, res) => {
    try {

        let data = await updateArtistService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}
const deleteArtist = async (req, res) => {
    let artistId = req.query.id
    try {

        let data = await DeleteArtistService(artistId)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}

module.exports = { getAllUser, handleCreateArtist, getAllArtist, UpdateArtist, deleteArtist, }