const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'other'],
        validate: function (value) {
            if(!['male', 'female', 'other'].includes(value)) {
                throw new Error('Invalid gender');
            }
        }
    },
    profile: {
        type: String,
        default: 'Hello, I am using this app!'
    },
    age: {
        type: Number,
        min: 18,
        validate: function (value) {
            if (value < 18) {
                throw new Error('Invalid age');
            }
        }
    },
   
});

const User = mongoose.model('User', userSchema);

module.exports = User;
