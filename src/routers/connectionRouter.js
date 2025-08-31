const express = require('express');
const connectionRouter = express.Router();
const user = require('../models/user');
const userAuthMiddleware = require('../middleware/auth');
const connectionRequest = require('../models/connectionRequest');

connectionRouter.post('/send/:status/:userId', userAuthMiddleware, async (req, res) => {
    try{
        const { status, userId } = req.params;
        const allowedRequests = ['interested', 'ignored'];

        const fromUser = req.user; // Authenticated user from middleware
        if (!allowedRequests.includes(status)) {
            return res.status(400).json({ error: 'Invalid request type' });
        }

        const toUser = await user.findById(userId);
        if (!toUser) {
            return res.status(404).json({ error: 'Requested User not found' });
        }

        const existingRequest = await connectionRequest.findOne({
        $or: [
            { fromRequestId: fromUser._id, toRequestId: toUser._id },
            { fromRequestId: toUser._id, toRequestId: fromUser._id }
        ]
        });
        
        if (existingRequest) {
            return res.status(400).json({ error: 'Connection request already exists' });
        }

        const newConnectionRequest = new connectionRequest({
            fromRequestId: fromUser._id,
            toRequestId: toUser._id,
            status
        });

        await newConnectionRequest.save();
        return res.status(200).json({ message: ` ${status} connection for user ${toUser.firstName}` });
    }catch(err){
        return res.json({message: err.message});
    }
});


connectionRouter.post('/review/:status/:requestId', userAuthMiddleware, async (req, res) => {
    try {
        const { status, requestId } = req.params;
        const allowedStatuses = ['accepted', 'rejected'];

        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({ error: 'Invalid status' });
        }

        const existedConnectionRequest = await connectionRequest.findOne({
            _id: requestId,
            toRequestId: req.user._id,
            status: "interested"
        });
        console.log(existedConnectionRequest);
        if (!existedConnectionRequest) {
            return res.status(404).json({ error: 'Connection request not found' });
        }

        existedConnectionRequest.status = status;
        await existedConnectionRequest.save();

        return res.status(200).json({ message: `Connection request ${status} for user }` });
    } catch (err) {
        return res.json({ message: err.message });
    }
});







module.exports = connectionRouter;
