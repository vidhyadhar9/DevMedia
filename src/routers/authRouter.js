const express = require('express');
const authRouter = express.Router();
const {authValidation } = require('../utillities/auth');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');

const User = require('../models/user');

authRouter.use(express.json());
authRouter.use(cookieParser());


// User signup route
authRouter.post('/signup',async (req,res)=>{

const user = new User({ ...req.body });

try {
    authValidation(req);
    const password = req.body.password;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    const result = await user.save();
    return res.status(201).send({ message: "User created successfully", data: result });
} catch (err) {
  // Handle duplicate email
  if (err.code === 11000) {
    return res.status(400).send({ message: "User with this email already exists" });
  }

  // Handle validation errors
  if (err.name === "ValidationError") {
    return res.status(400).send({ message: err.message });
  }

  // General error
  return res.status(500).send({ message: "Error creating user", error: err.message });
}

});

// User login route
authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });//this is the instanceof the user
        if (!user) {
            return res.status(404).send({ message: "Invalid credentials" });
        }
        const isPasswordvalid  = await user.passWordValidation(password); 
        console.log(isPasswordvalid);

        if (!isPasswordvalid) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const token = await user.getJWT();
        res.cookie('token', token);
        return res.status(200).send({ message: "Login successful" });
    } catch (err) {
        return res.status(500).send({ message: "Error logging in" });
    }
});


authRouter.post('/logout', (req, res) => {
    res.cookie('token',null,{expires: Date.now()});
    return res.status(200).send({ message: "Logout successful" });
});



module.exports = authRouter;
