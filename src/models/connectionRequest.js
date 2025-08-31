const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    fromRequestId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    toRequestId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        enum: ['interested','ignored', 'accepted', 'rejected'],
    }
})


connectionSchema.pre("save", function (next) {
  const connectionRequest = this;
  // Check if the fromRequestId is same as toRequestId
  if (connectionRequest.fromRequestId.equals(connectionRequest.toRequestId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
  next();
});

module.exports = mongoose.model('ConnectionRequest', connectionSchema);
