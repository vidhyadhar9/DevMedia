const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');
const authValidation = require('./utillities/auth');
const bcrypt = require('bcrypt');
const authMiddleware = require('./middleware/auth');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

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




//

// User signup route
app.post('/signup',async (req,res)=>{

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
app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send({ message: "Invalid credentials" });
        }

        // Here you would normally check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).send({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ id: user._id  }, 'SecretKey', { expiresIn: '1h' });
        res.cookie('token', token);
        return res.status(200).send({ message: "Login successful" });
    } catch (err) {
        return res.status(500).send({ message: "Error logging in" });
    }
});



app.get('/profile',authMiddleware,async (req, res) => {
    try {
        const user = req.user;
        return res.status(200).send({ message: "Profile fetched successfully", user });
    } catch (err) {
        return res.status(500).send({ message: "Error fetching profile" });
    }
});







app.use('/', (err, req, res,next) => { //express error middle ware
  // res.status(200).json({ message: "Root endpoint" });
  if(err){
    res.status(500).json({ message: "Internal Server Error" });
  }
});






