const { Connection } = require('mongoose');
const connection = require('../config/ConfigDataBase');
const { sendSimpleEmail } = require('./emailService');
const getdataDetailService = async (id) => {
    try {
        if (!id) {
            return ({
                EC: -1,
                MES: 'Missing Id '
            })
        }
        else {
            let data = await connection.Product.findOne({ _id: id }).populate('markdowns');

            return ({
                EC: 0,
                data: data
            })
        }
    } catch (error) {
        console.log(error)
    }
}
const MarkdownService = (dataMarkDown) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!dataMarkDown.contentMarkdown || !dataMarkDown.contentHTML || !dataMarkDown.productId || !dataMarkDown.action) {
                resolve({
                    EC: -1,
                    MES: 'no input received'
                })

            } else if (dataMarkDown.action === 'EDIT') {
                let data = await connection.Markdown.findOneAndUpdate(
                    { productId: dataMarkDown.productId },
                    {
                        contentMarkdown: dataMarkDown.contentMarkdown,
                        contentHTML: dataMarkDown.contentHTML,
                    },
                    { new: true } // Ensure the updated document is returned

                )
                if (!data) {
                    return resolve({
                        EC: -1,
                        MES: 'Product not found'
                    });
                }
                resolve({
                    EC: 0,
                    MES: 'Up data Success',
                    data
                })
            }
            else if (dataMarkDown.action === 'CREATE') {
                let check = await connection.Markdown.findOne({ productId: dataMarkDown.productId }
                )

                if (check) {

                    resolve({
                        EC: 3,
                        MES: 'Markdown isExist please update or create new'
                    })
                } else {
                    let data = await connection.Markdown.create({
                        contentHTML: dataMarkDown.contentHTML,
                        contentMarkdown: dataMarkDown.contentMarkdown,
                        productId: dataMarkDown.productId
                    })
                    await connection.Product.findByIdAndUpdate(
                        { _id: dataMarkDown.productId },
                        { $push: { markdowns: data._id } }
                    );
                    resolve({
                        EC: 0,
                        MES: 'Create data Success',
                        data
                    })
                }

            }

        } catch (e) {
            reject(e)
        }
    })
}
const sortProductService = (sort) => {
    return new Promise(async (resolve, reject) => {

        try {
            let data = []
            if (!sort) {
                let dataSort = await connection.Product.find().sort({ createdAt: -1 })
                resolve({
                    EC: 0,
                    MES: 'sort DESC success',
                    dataSort
                })
            }

            if (sort === 'DESC') {
                let dataSort = await connection.Product.find().sort({ createdAt: -1 })
                resolve({
                    EC: 0,
                    MES: 'sort DESC success',
                    dataSort
                })
            }
            if (sort === 'ASC') {
                let dataSort = await connection.Product.find().sort({ createdAt: 1 })
                resolve({
                    EC: 0,
                    MES: 'sort ACS success',
                    dataSort
                })
            }
            if (sort === 'LOWPRICE') {
                let dataSort = await connection.Product.find().sort({ count: 1 })
                resolve({
                    EC: 0,
                    MES: 'sort LOWPRICE success',
                    dataSort
                })
            }
            if (sort === 'HIGHPRICE') {
                let dataSort = await connection.Product.find().sort({ count: -1 })
                resolve({
                    EC: 0,
                    MES: 'sort HIGHPRICE success',
                    dataSort
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

const handleAddtoCart = async (userId, productId, quantity) => {

    try {
        let cart = await connection.Cart.findOne({ userId })

        if (!cart) {
            cart = new connection.Cart({ userId, item: [], totalPrice: 0 });
        }

        let product = await connection.Product.findById(productId)

        if (!product) {
            return (
                {
                    EC: 1,
                    MES: "Product not foul"
                }
            );
        }

        let existingItem = cart.items.find(item => item.productId.toString() === productId)


        let productCount = Number(product.count.toString().replace(/,/g, ''));
        let qty = Number(quantity);

        if (isNaN(productCount) || isNaN(qty)) {
            throw new Error("Invalid product count or quantity");
        }

        if (!cart.totalPrice || isNaN(cart.totalPrice)) {
            cart.totalPrice = 0;
        }
        if (existingItem) {
            existingItem.quantity += qty;
            existingItem.total = existingItem.quantity * productCount
        }

        else {
            cart.items.push({ productId, quantity, total: productCount * quantity });
        }
        cart.totalPrice += productCount * qty;
        await cart.save();
        return ({
            EC: 0,
            MES: "Thêm vào giỏ hàng thành công",
            cart
        });


    } catch (error) {
        console.log(error)
    }
}
const handleGetCart = async (userId) => {
    try {
        let cart = await connection.Cart.findOne({ userId }).populate('items.productId', 'nameProduct count image1 typeProduct');
        if (!cart) return ({
            EC: 1,
            MES: "cart is empty"
        });
        return ({ EC: 0, MES: "Get cart successfully", cart });
    } catch (error) {
        console.log(error)
    }
}
const handleDeleteCart = async (userId, productId) => {
    try {
        let cart = await connection.Cart.findOne({ userId });
        if (!cart) return ({
            EC: 1,
            MES: 'Cart does not exist'
        })
        let itemIndex = cart.items.findIndex(item => item.productId.toString() === productId)
        if (itemIndex === -1) return {
            EC: 1,
            MES: "Product not in cart"
        };
        let item = cart.items[itemIndex]
        // Chuyển product.count sang num
        let product = await connection.Product.findById(productId);
        let productCount = Number(product.count.toString().replace(/,/g, ''));
        // tinh tien
        cart.totalPrice -= productCount * item.quantity
        //
        cart.items.splice(itemIndex, 1)
        await cart.save();
        return ({
            EC: 0,
            MES: "Delete Success"
        })
    } catch (error) {
        console.log(error)
    }
}
const HandleCheckOut = async (userId, paymentMethod, address, phoneNumber, email) => {

    try {
        if (!address || !phoneNumber || !paymentMethod || !userId || !email) {
            return ({
                EC: -2,
                MES: 'Missing input '
            })
        }
        let cart = await connection.Cart.findOne({ userId }).populate('items.productId')
        if (!cart || cart.items.length === 0) {
            return ({
                EC: 1,
                MES: 'cart is empty'
            })
        }

        let order = new connection.Order({
            userId,
            items: cart.items.map(item => ({
                productId: item.productId._id,
                quantity: item.quantity,
                price: Number(item.productId.count.toString().replace(/,/g, '')) * item.quantity
            })),
            totalAmount: cart.totalPrice,
            paymentMethod,
            status: 'Pending',
            address: address,
            phoneNumber: phoneNumber,
            orderCode: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
            email: email
        })
        await order.save();
        await connection.Cart.deleteOne({ userId })

        return ({
            EC: 0,
            MES: "Payment successful", order
        });
    } catch (error) {
        console.log(error)
    }
}
const getHistoryService = async (userId) => {
    try {
        if (!userId) {
            return ({
                EC: -1,
                MES: 'missing id'
            })
        }
        if (userId === 'ALL_ORDERS') {
            let orders = await connection.Order.find().populate('items.productId', 'nameProduct count image1',).sort({ createdAt: -1 });;
            return ({
                EC: 0,
                MES: "get all order success",
                orders
            });
        }
        let orders = await connection.Order.find({ userId }).populate('items.productId', 'nameProduct count image1',);
        return ({
            EC: 0,
            MES: "get history success",
            orders
        });
    } catch (e) {
        console.log(e)
    }
}

const handleStatusOrder = async (orderId, status) => {
    try {
        if (status === 'DELETE') {
            const order = await connection.Order.deleteOne({ _id: orderId })
            if (!order) {
                return ({
                    EC: 2,
                    MES: 'Order not found'
                })
            }
            else {
                return ({
                    EC: 0,
                    MES: 'Delete order Success'
                })
            }
        }
        let newStatus = ''
        if (status === 'OK') {
            newStatus = 'Completed'
        }
        else if (status === 'NO') {
            newStatus = 'Canceled'
        }
        else {
            return ({
                EC: -1,
                MES: 'Invalid Status'
            })
        }
        const order = await connection.Order.findById(orderId).populate('items.productId');
        if (!order) {
            return ({
                EC: 2,
                MES: 'Order not found'
            });
        }
        order.status = newStatus;
        await order.save();

        email = order?.email
        sendSimpleEmail({
            receiverEmail: email,
            orderDetails: {
                orderCode: order.orderCode,
                address: order.address,
                phoneNumber: order.phoneNumber,
                totalAmount: order.totalAmount,
                items: order.items
            }
        })
        return ({
            EC: 0,
            MES: 'Order status updated Success'
        })
    } catch (e) {
        console.log(e)
    }
}
const handleGetProductBySearch = async (name) => {
    try {
        if (!name) {
            return ({
                EC: 1,
                MES: 'missing Input'
            })
        }
        let products = await connection.Product.find({
            nameProduct: { $regex: name, $options: 'i' }
        })
        if (products.length > 0) {
            return ({

                EC: 0,
                MES: 'Search successful',
                products
            });
        } else {
            return {
                EC: 1,
                MES: 'No products found',
                products: []
            };
        }
    } catch (e) {
        console.log(e)
    }
}
module.exports = {
    getdataDetailService, MarkdownService, sortProductService, handleAddtoCart, handleGetCart,
    handleDeleteCart, HandleCheckOut, getHistoryService, handleGetProductBySearch, handleStatusOrder
}