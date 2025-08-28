const mongoose = require('mongoose')
require('dotenv').config()
const URL = process.env.URL


const connectDB = async() => {
    await mongoose.connect(URL)
}


module.exports = connectDB;

