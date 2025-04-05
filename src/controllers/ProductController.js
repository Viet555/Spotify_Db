const { getdataDetailService, MarkdownService, sortProductService, handleAddtoCart,
    handleGetCart, handleDeleteCart, HandleCheckOut, getHistoryService, handleGetProductBySearch, handleStatusOrder } = require("../sevices/ProductService")

const getDetailProduct = async (req, res) => {
    try {
        let id = req.query.id
        let dataDetail = await getdataDetailService(id)
        return res.status(200).json(dataDetail)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'Err from sv'
        })
    }
}
const handleMarkDown = async (req, res) => {
    try {

        let dataDeMarkdown = await MarkdownService(req.body)
        return res.status(200).json(dataDeMarkdown)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'Err from sv'
        })
    }
}
const fetchAllProductBySort = async (req, res) => {
    try {
        let sort = req.query.sort

        let dataSort = await sortProductService(sort)
        return res.status(200).json(dataSort)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'Err from sv'
        })
    }
}
const addToCart = async (req, res) => {
    try {

        let { userId, productId, quantity } = req.body
        let response = await handleAddtoCart(userId, productId, quantity)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
const getCart = async (req, res) => {
    try {
        let { userId } = req.query;
        let response = await handleGetCart(userId)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
const DeleteCart = async (req, res) => {
    try {
        let { productId, userId } = req.query;
        let response = await handleDeleteCart(userId, productId)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
const Ordercheckout = async (req, res) => {
    try {
        let { email, userId, paymentMethod, address, phoneNumber } = req.body

        let response = await HandleCheckOut(userId, paymentMethod, address, phoneNumber, email)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
const getHistory = async (req, res) => {
    try {
        let { userId, } = req.query

        let response = await getHistoryService(userId)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
const productSearch = async (req, res) => {
    try {

        let { name } = req.query
        let response = await handleGetProductBySearch(name)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
const statusOrder = async (req, res) => {
    try {

        let { orderId, status } = req.query
        let response = await handleStatusOrder(orderId, status)
        return res.status(200).json(response)

    } catch (e) {
        console.log(e)
        return res.status(404).json({
            EC: 1,
            MES: 'err From sv'
        })
    }
}
module.exports = {
    getDetailProduct, handleMarkDown, fetchAllProductBySort, addToCart, getCart, DeleteCart,
    Ordercheckout, getHistory, productSearch, statusOrder
}