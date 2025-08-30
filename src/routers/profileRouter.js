
const express = require('express');
const profileRouter = express.Router();
const authMiddleware = require('../middleware/auth');
const { VerificationOfUserUpdate } = require('../utillities/auth');

profileRouter.get('/view', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).send({ message: "Profile fetched successfully", user });
    } catch (err) {
        return res.status(500).send({ message: "Error fetching profile" });
    }
});


profileRouter.patch('/edit', authMiddleware, async (req, res) => {
    try{
        const user = req.user;
        const updates = req.body;
        if(!VerificationOfUserUpdate(updates)){
            return res.status(400).send({ message: "Invalid profile updates" });
        }
        Object.keys(updates).forEach((key) => {
            user[key] = updates[key];
        });
        await user.save();
        return res.status(200).send({ message: "Profile updated successfully", user });
    }catch(err){
        return res.status(500).send({ message: "Error updating profile" });
    }
});


profileRouter.patch('/password', authMiddleware, async (req, res) => {
    try {
        const user = req.user;
        const newPassword = req.body.password;

        if (!newPassword) {
            return res.status(400).send({ message: "New password is required" });
        }
        const isValidPassword = user.passWordValidation(newPassword);
        if(!isValidPassword) {
            return res.status(400).send({ message: "New password is not strong enough" });
        }
        const newHashedPassword = await user.getJWT();
        user.password = newHashedPassword;
        await user.save();
        return res.status(200).send({ message: "Password updated successfully" });
        // Update password
    }catch(err){
        return res.status(500).send({ message: "Error updating password" });
    }
});


module.exports = profileRouter;