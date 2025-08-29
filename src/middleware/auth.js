const express = require('express');
const app = express();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

const authMiddleware = async(req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).send({ message: "Unauthorized" });
    }

    try {
        const decoded = jwt.verify(token, 'SecretKey');
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }
        req.user = user;
        next();
    } catch (err) {
        return res.status(401).send({ message: "Unauthorized" });
    }
};

module.exports = authMiddleware;