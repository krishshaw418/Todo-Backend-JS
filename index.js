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
app.use(express.json());
app.use(cors({ credentials: true, origin : "*"}));
app.use(cookieParser());

app.get(`/`, async(req, res) => {
    res.send("Hello from the server!");
})
app.use('/user', userRoutes);
app.use('/user/action', actionRoutes);

app.listen(port, () =>{
    console.log(`Server is running on port ${port}`);
})