const connection = require('../config/ConfigDataBase')
const jwt = require('jsonwebtoken');
require('dotenv').config();
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const CreateUserService = (dataUser) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!dataUser.firstName || !dataUser.lastName || !dataUser.email || !dataUser.password) {

                resolve({
                    EC: -1,
                    MES: ' Missing Input params'
                })
            }
            let checkEmail = await checkUserEmail(dataUser.email)
            if (checkEmail === true) {
                resolve({
                    EC: 1,
                    MES: 'email already exists'
                })
            }
            let hashPasswordUser = await hashUserPassword(dataUser.password)
            if (checkEmail == false) {
                let roleId = ''
                if (!dataUser.roleId) {
                    roleId = 'User'
                }
                let data = await connection.User.create({

                    firstName: dataUser.firstName,
                    lastName: dataUser.lastName,
                    password: hashPasswordUser,
                    email: dataUser.email,
                    roleId: roleId,
                    image: dataUser.image,
                    gender: dataUser.gender,
                    address: dataUser.address,
                })
                resolve({
                    EC: 0,
                    MES: 'CREATE SUCCESS',
                    data
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const checkUserEmail = (Useremail) => {

    return new Promise(async (resolve, reject) => {

        try {


            let user = await connection.User.findOne(
                { email: Useremail }
            )

            if (user) {
                resolve(true)

            } else {
                resolve(false)
            }
        } catch (e) {
            reject(e)
        }
    })
}
const hashUserPassword = (password) => {
    return new Promise((resolve, reject) => {
        try {
            let hashPassword = bcrypt.hashSync(password, salt);
            resolve(hashPassword)
        } catch (e) {
            reject(e)
        }
    })
}
const UserLogin = async (dataLog) => {
    return new Promise(async (resolve, reject) => {

        try {
            if (!dataLog.email || !dataLog.password) {
                resolve({
                    EC: -1,
                    MES: 'Missing Input !'
                })
            }

            let isexist = await checkUserEmail(dataLog.email)

            if (isexist) {

                let user = await connection.User.findOne(
                    { email: dataLog.email },

                )

                if (user) {
                    //sspass
                    let checkPass = await bcrypt.compareSync(dataLog.password, user.password)
                    if (checkPass) {
                        let userData = user.toObject();// chueyn sag plan obj
                        delete userData.password;

                        let cart = await connection.Cart.findOne({ userId: user._id })
                        if (cart) {
                            userData.cart = cart
                        }
                        if (!cart) {
                            userData.cart = {}
                        }
                        let payload = ({
                            email: user.email,
                            role: user.roleId
                        })
                        let key = process.env.JWT_SECRET

                        let token = jwt.sign(payload, key, { expiresIn: process.env.JWT_EXPIRE })
                        let refreshToken = jwt.sign(payload, key, { expiresIn: '7d' });
                        resolve({
                            EC: 0,
                            MES: ' Login Sucess',
                            refreshToken: refreshToken,
                            accessToken: token,
                            data: userData,

                        })

                    }
                    else {
                        resolve({
                            EC: 3,
                            MES: "Oh no! Wrong password"
                        })
                    }
                }
                else {
                    resolve({
                        EC: 2,
                        MES: `User not found`
                    })
                }
            }
            else {
                resolve({
                    EC: -1,
                    MES: `Email don't exist`
                })
            }


        } catch (e) {
            reject(e)
        }
    })
}
const handleGetAllUser = (id, limit, page) => {
    return new Promise(async (resolve, reject) => {

        try {
            let totalUsers = await connection.User.countDocuments();
            let totalPages = Math.ceil(totalUsers / limit);
            let dataUsers = ''
            if (id === 'ALL') {
                let dataUsers = await connection.User.find()
                    .skip((page - 1) * limit) // Bỏ qua user của trang trước
                    .limit(limit)
                    .select('-password');

                resolve({
                    EC: 0,
                    MES: 'fetch All Success',
                    data: dataUsers,
                    totalPages: totalPages, // Số trang tổng cộng
                    currentPage: page // Trang hiện tại
                }
                )
            }
            if (id && id !== 'ALL') {
                let dataUsers = await connection.User.findOne(
                    { _id: id }
                ).select('-password')
                if (dataUsers) {
                    resolve({
                        EC: 0,
                        MES: 'fetch User Success',
                        data: dataUsers
                    }
                    )
                }
                else {
                    resolve({
                        EC: -1,
                        MES: 'USER NOT FOUND !'
                    })
                }
            }
            // resolve({
            //     Ec: 0,
            //     MES: 'Fetch All User SS',
            //     data: dataUsers
            // })
        } catch (e) {
            reject(e)
        }
    })
}
const handleDeleteUser = (UserId) => {

    return new Promise(async (resolve, reject) => {

        try {
            if (!UserId) {
                resolve({
                    EC: '-1',
                    MES: "missing input params"
                })
            }
            else {
                await connection.User.deleteOne({ _id: UserId })
                resolve({
                    EC: 0,
                    MES: 'Delete User Success'
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}
const handleUpdateUser = (dataEdit) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!dataEdit._id) {
                resolve({
                    EC: -1,
                    MES: 'Missing Input Id '
                })
            }
            const user = await connection.User.findById(dataEdit._id);
            if (!user) {
                return resolve({
                    EC: -1,
                    MES: 'User not found'
                });
            }
            let updateData = {
                firstName: dataEdit.firstName,
                lastName: dataEdit.lastName,
                address: dataEdit.address,
                roleId: dataEdit.roleId,
                gender: dataEdit.gender,
                phoneNumber: dataEdit.phoneNumber,
                image: dataEdit.avatar,
            }
            if (dataEdit.currentPassword) {
                //ss
                let isMatch = await bcrypt.compare(dataEdit.currentPassword, user.password)
                if (!isMatch) {
                    resolve({
                        EC: -1,
                        MES: 'Mật khẩu hiện tại không chính xác'
                    })
                }
                updateData.password = await hashUserPassword(dataEdit.newPassword)
            }

            let User = await connection.User.findOneAndUpdate({
                _id: dataEdit._id
            },
                updateData,
            )
            if (!User) {
                return resolve({
                    EC: -1,
                    MES: 'User not found'
                });
            }
            resolve({
                EC: 0,
                MES: 'User updated successfully',
                data: User
            });

        } catch (e) {
            reject(e)
        }
    })
}


module.exports = { CreateUserService, UserLogin, handleGetAllUser, handleDeleteUser, handleUpdateUser, }