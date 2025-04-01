const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const port = process.env.PORT;
const cors = require('cors');
const connectDB = require('./configuration/db');
connectDB();
const cookieParser = require("cookie-parser");
const userRoutes = require ('./routes/userRoutes');
const actionRoutes = require ('./routes/actionRoutes');
const path = require('path');
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// app.get(`/`, async(req, res) => {
//     console.log("Hello form the server!");
//     res.send("Hello from the server!");
// })
app.use('/user', userRoutes);
app.use('/user/action', actionRoutes);

app.use(express.static('public'));
app.use('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
})

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})