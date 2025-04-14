const { default: mongoose } = require('mongoose')
const connection = require('../config/ConfigDataBase')

const handleCreateProduct = (dataProduct) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!dataProduct.nameProduct || !dataProduct.count || !dataProduct.desProduct || !dataProduct.code || !dataProduct.typeProduct || !dataProduct.image1) {
                resolve({
                    EC: 1,
                    MES: 'Missing Input Params'
                })
            }
            else {
                let check = await checkCodeProduct(dataProduct.code)
                if (check === true) {
                    resolve({
                        EC: 2,
                        MES: 'code already exists'
                    })
                }
                else {
                    let data = await connection.Product.create({
                        nameProduct: dataProduct.nameProduct,
                        count: dataProduct.count,
                        note: dataProduct.note,
                        desProduct: dataProduct.desProduct,
                        code: dataProduct.code,
                        typeProduct: dataProduct.typeProduct,
                        image1: dataProduct.image1,
                        image2: dataProduct.image2,
                        bannerProduct: dataProduct.bannerProduct
                    })
                    resolve({
                        EC: 0,
                        MES: 'Create Product Success ',

                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}
const checkCodeProduct = async (codePro) => {
    try {
        let check = await connection.Product.findOne({ code: codePro })
        if (check) {
            return (true)
        } else {
            return (false)
        }
    } catch (e) {
        console.log(e)
    }
}
const handleGetAlldataPagiNate = (type, limit, page) => {
    return new Promise(async (resolve, reject) => {

        try {

            let totalProduct = await connection.Product.countDocuments();

            let totalPages = Math.ceil(totalProduct / limit);

            let product = ''
            if (type) {
                let product = await connection.Product.find({ typeProduct: type })
                    .limit(limit)
                    .skip((page - 1) * limit)
                if (product) {
                    resolve({
                        EC: 0,
                        MES: 'Fecth product ok ',
                        data: product,
                        totalPages: totalPages,
                        currentPage: page
                    })
                } else {

                    resolve({
                        EC: 2,
                        MES: 'Product not foul',

                    })
                }

            }
            else {

                let product = await connection.Product.find()
                    .limit(limit)
                    .skip((page - 1) * limit)
                resolve({
                    EC: 0,
                    MES: 'Fecth All Product ok ',
                    data: product,
                    totalPages: totalPages,
                    currentPage: page
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const handleDeleteProduct = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    EC: -1,
                    MES: 'Missing ID'
                })
            } else {
                let product = await connection.Product.findOne({ _id: id })
                if (product) {
                    await connection.Product.deleteOne({ _id: id })
                    resolve({
                        EC: 0,
                        MES: 'Delete product Success'
                    })
                }
                else {
                    resolve({
                        EC: 2,
                        MES: 'Product does not exist'
                    })
                }

            }
        } catch (e) {
            reject(e)
        }
    })
}
const handleUpdateProduct = (ProductId) => {

    return new Promise(async (resolve, reject) => {
        try {
            if (!ProductId._id) {
                resolve({
                    EC: -1,
                    MES: 'Missing ID'
                })
            }
            let dataUpdate = await connection.Product.findByIdAndUpdate(
                { _id: ProductId._id },
                {
                    nameProduct: ProductId.nameProduct,
                    count: ProductId.count,
                    note: ProductId.note,
                    desProduct: ProductId.desProduct,
                    code: ProductId.code,
                    typeProduct: ProductId.typeProduct,
                    image1: ProductId.image1,
                    image2: ProductId.image2,
                    bannerProduct: ProductId.bannerProduct
                }
            )
            if (!dataUpdate) {
                return resolve({
                    EC: -1,
                    MES: 'Product not found'
                });
            }

            resolve({
                EC: 0,
                MES: 'Product updated successfully',
            });
        } catch (e) {
            reject(e)
        }
    })
}
const handleGetDataTypes = async () => {
    try {
        let dataType = await connection.AllCode.find()
        if (dataType) {
            return ({
                EC: 0,
                MES: 'Fetch Success',
                data: dataType
            })
        } else {
            return ({
                EC: -2,
                MES: 'Err '
            })
        }
    } catch (e) {
        console.log(e)
    }
}
const handleCreateBanner = (dataBanner) => {
    return new Promise(async (resolve, reject) => {

        try {
            // let productObjectId;
            // try {
            //     productObjectId = new mongoose.Types.ObjectId(dataBanner.productId);
            // } catch (error) {
            //     return resolve({ EC: -2, MES: "Invalid Product ID format." });
            // }
            if (!dataBanner.name || !dataBanner.productId || !dataBanner.image) {
                resolve({
                    EC: -1,
                    MES: 'Missing data'
                })
            }

            else {
                // Chuyển productId từ String sang ObjectId
                const productObjectId = new mongoose.Types.ObjectId(dataBanner.productId);
                let check = await connection.Banner.find({ "bannerHeader.productId": productObjectId })

                if (check.length === 0) {
                    if (dataBanner && dataBanner.action === 'Bfirst') {
                        let data = await connection.Banner.create(
                            {
                                bannerHeader: {
                                    name: dataBanner.name,
                                    productId: dataBanner.productId,
                                    image: dataBanner.image
                                }
                            })
                        resolve({
                            EC: 0,
                            MES: 'Create Banner Header Succsess',
                            data
                        })
                    }
                    if (dataBanner && dataBanner.action === 'Bsecond') {
                        let data = await connection.Banner.create({
                            bannerMidle: {
                                name: dataBanner.name,
                                productId: dataBanner.productId,
                                image: dataBanner.image
                            }
                        }
                        )
                        resolve({
                            EC: 0,
                            MES: 'Create Banner middle Succsess',
                            data
                        })
                    }
                } else {
                    resolve({
                        EC: 3,
                        MES: 'Banner is Exsit'
                    })
                }
            }

        } catch (e) {
            reject(e)
        }
    })
}
const handleUpdateBanner = (dataBanner) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataBanner._id || !dataBanner.action) {
                resolve({
                    EC: 1,
                    MES: 'Missing Input'
                })
            }
            if (dataBanner.action === 'Bfirst') {
                let data = await connection.Banner.findByIdAndUpdate(
                    dataBanner._id,
                    {
                        bannerHeader: {
                            name: dataBanner.name,
                            productId: dataBanner.productId,
                            image: dataBanner.image
                        },
                    }, { new: true }

                )
                if (!data) {
                    resolve({
                        EC: 2,
                        MES: 'Banner not foul'
                    })
                }
                resolve({
                    EC: 0,
                    MES: 'Update Success',
                    data
                })
            }
            if (dataBanner.action === 'Bsecond') {
                let data = await connection.Banner.findByIdAndUpdate(
                    dataBanner._id,
                    {
                        bannerMidle: {
                            name: dataBanner.name,
                            productId: dataBanner.productId,
                            image: dataBanner.image
                        },
                    }, { new: true }

                )
                if (!data) {
                    resolve({
                        EC: 2,
                        MES: 'Banner not foul'
                    })
                }
                resolve({
                    EC: 0,
                    MES: `Update Success`,
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const fetchAllBanner = async (action, limit) => {
    try {
        if (!action) {
            return {
                EC: -1,
                MES: 'Missing Action'
            };
        } else {
            if (action === 'Bfirst') {
                if (!limit) limit = 4;
                let data = await connection.Banner.find({ bannerHeader: { $exists: true, $not: { $size: 0 } } })
                    .limit(limit)
                    .select('bannerHeader')
                    .select('-bannerMidle')
                    .populate("bannerHeader.productId")
                    .sort({ createdAt: -1 });
                return {
                    EC: 0,
                    data
                };
            }
            if (action === 'Bsecond') {
                if (!limit) limit = 2;
                let data = await connection.Banner.find({ bannerMidle: { $exists: true, $not: { $size: 0 } } })
                    .limit(limit)
                    .select('bannerMidle')
                    .populate("bannerMidle.productId")
                    .sort({ createdAt: -1 });
                return {
                    EC: 0,
                    data
                };
            }
        }
    } catch (e) {
        console.log(e);
    }
};
const handleDeleteBanner = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    EC: -1,
                    MES: 'Missing Id '
                })
            }
            let BannerDele = await connection.Banner.findByIdAndDelete({ _id: id })
            if (!BannerDele) {
                resolve({
                    EC: 2,
                    MES: 'Banner Not foul'
                })
            }
            resolve({
                EC: 0,
                MES: 'Delete Success'
            })
        } catch (e) {
            reject(e)
        }
    })

}
const handleFetchAllProduct = async (type, limit) => {
    try {

        if (type && limit) {
            let dataProduct = await connection.Product.find({ typeProduct: type }).limit(limit).sort({ createdAt: -1 })
            return ({
                EC: 0,
                MES: 'Fetch limit by type Success',
                data: dataProduct
            })
        }
        if (type) {
            let dataProduct = await connection.Product.find({ typeProduct: type })
            return ({
                EC: 0,
                MES: 'Fetch All by type Success',
                data: dataProduct
            })
        }

        if (limit) {
            let dataProduct = await connection.Product.find().limit(limit).sort({ createdAt: -1 })
            return ({
                EC: 0,
                MES: 'Fetch Product limit Success',
                data: dataProduct
            })
        }

        else {
            let dataProduct = await connection.Product.find()
            return ({
                EC: 0,
                MES: 'Fetch All Success',
                data: dataProduct
            })
        }

    } catch (e) {
        console.log(e)
    }
}
module.exports = {
    handleCreateProduct, handleGetAlldataPagiNate, handleDeleteProduct, handleUpdateProduct, handleGetDataTypes,
    handleCreateBanner, handleUpdateBanner, fetchAllBanner, handleDeleteBanner, handleFetchAllProduct
}