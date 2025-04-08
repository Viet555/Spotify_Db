const express = require('express')
const app = express() //framwork giup chay dc 1 websv
require('dotenv').config();
const Router = require('./routes/api')
const routerPass = require('./sevices/ResertPassword')
const port = process.env.PORT || 8888;
const hostname = process.env.HOST_NAME || 'localhost';
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { initGridFS } = require('./config/Gridfs');
const path = require('path');
//config req.body => laasy len data
// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', process.env.REACT_URL);
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))
// Cho FE truy cập thư mục uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser())
// configViewEngine(app);


//khai bao route
// app.use('/', webRoutes);

app.use('/', Router)
app.use('/', routerPass)
app.use((req, res) => {
    return res.send('404 not found')
})
app.listen(port, hostname, () => {
    console.log(`✅ Server running at http://${hostname}:${port}`);
});