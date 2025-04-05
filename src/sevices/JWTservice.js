const jwt = require('jsonwebtoken');
const connection = require('../config/ConfigDataBase');
const refreshTokenService = (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!refreshToken) {
                return ({
                    EC: -1,
                    MES: "No refresh token provided"
                });
            }
            jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) {
                    resolve({
                        EC: -1,
                        MES: "Invalid or expired refresh token"
                    });
                }
                const user = await connection.User.findById(decoded.email);
                if (!user) {
                    resolve(
                        {
                            EC: -2,
                            MES: "User not found"
                        }
                    );
                }
                const payload = {
                    email: user.email,
                    role: user.roleId
                };
                const newAccessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
                resolve({
                    EC: 0,
                    accessToken: newAccessToken
                })
            })
        } catch (e) {
            reject(e)
        }
    })

}
module.exports = { refreshTokenService }