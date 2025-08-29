const mongoose = require('mongoose')
const dotenv = require('dotenv')

dotenv.config()
const URL = process.env.URL


const connectDB = async() => {
    await mongoose.connect(URL)
}


module.exports = connectDB;

