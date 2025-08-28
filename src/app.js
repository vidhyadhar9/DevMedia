const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());


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
            return res.status(404).send({ message: "User not found" });
        }

        // Here you would normally check the password
        if (user.password !== password) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        return res.status(200).send({ message: "Login successful" });
    } catch (err) {
        return res.status(500).send({ message: "Error logging in" });
    }
});


app.patch('/update', async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOneAndUpdate(
            { email },
            { $set: req.body },
            { new: true }
        );

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send({ message: "User updated successfully", user });
    } catch (err) {
        return res.status(500).send({ message: "Error updating user" });
    }
});

app.delete('/delete', async (req, res) => {
    const email = req.body.email;

    try {
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        return res.status(200).send({ message: "User deleted successfully" });
    } catch (err) {
        return res.status(500).send({ message: "Error deleting user" });
    }
});





app.use('/', (err, req, res,next) => { //express error middle ware
  // res.status(200).json({ message: "Root endpoint" });
  if(err){
    res.status(500).json({ message: "Internal Server Error" });
  }
});






