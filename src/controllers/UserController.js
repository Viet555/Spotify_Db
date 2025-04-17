const { refreshTokenService } = require("../sevices/JWTService")
const { CreateUserService, UserLogin, handleDeleteUser, handleUpdateUser, getSelectArtistService } = require("../sevices/UserSevice")

const CreateUser = async (req, res) => {
    try {
        let data = await CreateUserService(req.body)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: -1,
            MES: 'err From sv'
        })
    }
}
const handleLogin = async (req, res) => {

    try {
        let userData = await UserLogin(req.body)
        return res.status(200).json(userData)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: '-1',
            MES: 'ERR FORM SV'
        })
    }
}

const deleteUser = async (req, res) => {
    let id = req.query.id
    try {
        let response = await handleDeleteUser(id)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: 1,
            MES: 'ERR FROM SV'
        })
    }
}
const UpdateUser = async (req, res) => {
    try {
        let dataUpdate = await handleUpdateUser(req.body)
        return res.status(200).json(dataUpdate)
    } catch (e) {
        console.log(e)
        return res.status(400).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}
const handleRefreshToken = async (req, res) => {
    try {
        let { refreshToken } = req.body;
        let data = await refreshTokenService(refreshToken)
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}
const getSelectArtist = async (req, res) => {
    try {
        let data = await getSelectArtistService()
        return res.status(200).json(data)
    } catch (e) {
        console.log(e)
        return res.status(200).json({
            EC: -1,
            MES: 'ERR FROM SV'
        })
    }
}

module.exports = { CreateUser, handleLogin, deleteUser, UpdateUser, handleRefreshToken, getSelectArtist, }