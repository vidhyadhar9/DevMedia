const mongoose = require('mongoose')
require('dotenv').config()
const URL = "mongodb+srv://vattevidhyadharreddy18:Vidhii@cluster0.kngcrcp.mongodb.net/DevMedia"


const connectDB = async() => {
    await mongoose.connect(URL)
}


module.exports = connectDB;

