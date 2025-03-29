const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL, );
        console.log("DataBase connected!");
    } catch (error) {
        console.error("Error connecting to the DataBase:", error);
        process.exit(1);
    }
}
module.exports = connectDB;