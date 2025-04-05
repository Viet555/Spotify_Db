const { handleCreateProduct, handleGetAlldata, handleDeleteProduct, handleUpdateProduct, handleGetDataTypes,
    handleGetAlldataPagiNate, handleCreateBanner, handleUpdateBanner, fetchAllBanner, handleDeleteBanner, handleFetchAllProduct } = require("../sevices/AdminService")


const CreateNewProduct = async (req, res) => {
    try {
        let data = await handleCreateProduct(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: ' ERR Form Sever'
        })
    }
}
const getProductBytype = async (req, res) => {
    try {
        type = req.query.type
        limit = req.query.limit
        page = req.query.page
        if (!limit) limit = '6'

        let dataGet = await handleGetAlldataPagiNate(type, limit, page)
        return res.status(200).json(dataGet)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: 1,
            MEs: 'err from sv'
        })
    }
}
const deleteAproduct = async (req, res) => {
    let id = req.query.id
    try {
        let response = await handleDeleteProduct(id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: 1,
            MEs: 'err from sv'
        })
    }
}
const updateProduct = async (req, res) => {
    try {
        let dataRes = await handleUpdateProduct(req.body)
        return res.status(200).json(dataRes)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: 1,
            MEs: 'err from sv'
        })
    }
}
const getDataType = async (req, res) => {
    try {
        let type = await handleGetDataTypes()
        return res.status(200).json(type)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: 1,
            MEs: 'err from sv'
        })

    }
}
const createBanner = async (req, res) => {
    try {
        let response = await handleCreateBanner(req.body)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MEs: 'err from sv'
        })

    }
}
const updateBanner = async (req, res) => {
    try {
        // let action = req.query.action
        let dataUp = await handleUpdateBanner(req.body)
        return res.status(200).json(dataUp)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MEs: 'err from sv'
        })
    }
}
const getAllBanner = async (req, res) => {
    try {
        action = req.query.action
        limit = req.query.limit

        let Banner = await fetchAllBanner(action, limit)
        return res.status(200).json(Banner)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MEs: 'err from sv'
        })
    }
}
const Deletebanner = async (req, res) => {
    try {
        let id = req.query.id
        let data = await handleDeleteBanner(id)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'err from sv'
        })
    }
}
const fetchAllProductByType = async (req, res) => {
    try {
        type = req.query.type
        limit = req.query.limit
        let data = await handleFetchAllProduct(type, limit)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'err from sv'
        })
    }
}
module.exports = {
    CreateNewProduct, getProductBytype, deleteAproduct, updateProduct, getDataType, createBanner, updateBanner, getAllBanner,
    Deletebanner, Deletebanner, fetchAllProductByType
}