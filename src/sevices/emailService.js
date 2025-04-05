const nodemailer = require("nodemailer");
require('dotenv').config()
const sendSimpleEmail = async (dataSend) => {
    const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for port 465, false for other ports
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_APP_PASSWORD,
        },
    });

    let orderItemsHtml = dataSend.orderDetails.items.map(item => `
        <tr>
            <td>${item.productId?.nameProduct}</td>
            <td>${item.quantity}</td>
            <td>${item.price.toLocaleString()} đ</td>
        </tr>
    `).join('');

    const emailContent = `
        <h3>Xin Chào,</h3>
        <p>Bạn nhận được email này vì đã xác nhận đặt hàng từ Comicola.</p>
        <p><strong>Mã đơn hàng:</strong> ${dataSend.orderDetails.orderCode}</p>
        <p><strong>Địa chỉ:</strong> ${dataSend.orderDetails.address}</p>
        <p><strong>Số điện thoại:</strong> ${dataSend.orderDetails.phoneNumber}</p>
        <h4>Chi tiết đơn hàng:</h4>
        <table border="1" cellspacing="0" cellpadding="5">
            <thead>
                <tr>
                    <th>Sản phẩm</th>
                    <th>Số lượng</th>
                    <th>Giá</th>
                </tr>
            </thead>
            <tbody>
                ${orderItemsHtml}
            </tbody>
        </table>
        <p><strong>Tổng tiền:</strong> ${dataSend.orderDetails.totalAmount.toLocaleString()} VND</p>
        <p>Cảm ơn bạn đã mua hàng! 😊</p>
    `;
    const info = await transporter.sendMail({
        from: '"COMICOLA 🥳🎉" <ngoqviet1011@gmail.com>',
        to: dataSend.receiverEmail,
        subject: "Hello ✔",
        text: "Hello world?",
        html: emailContent
    });
}

module.exports = { sendSimpleEmail }