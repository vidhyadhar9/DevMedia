const express = require('express');
const connectDB = require('./config/database');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const authRouter = require('./routers/authRouter');
const profileRouter = require('./routers/profileRouter');

const app = express();
app.use(express.json());
app.use(cookieParser());

connectDB().then(() => {
    console.log("MongoDB connected")
    app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
}).catch((err) => {
    console.log("MongoDB connection failed",err)
})


app.use('/auth',authRouter);
app.use('/profile',profileRouter);










app.use('/', (err, req, res,next) => { //express error middle ware
  // res.status(200).json({ message: "Root endpoint" });
  if(err){
    res.status(500).json({ message: "Internal Server Error" });
  }
});






