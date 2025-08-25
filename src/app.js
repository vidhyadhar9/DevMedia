const express = require('express');
const connectDB = require('./config/database');
const User = require('./models/user');

const app = express();
app.use(express.json());



app.post('/signup',async (req,res)=>{

  const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
  });

 try{
      const result = await user.save();
      console.log(result);
      if(result){
        return res.status(201).send({ message: "User created successfully" });
      }else{
        return res.status(500).send({ message: "User already existed" });
      }
  }catch(err){
      return res.status(500).send({ message: "Error creating user" });
  }
});

connectDB().then(() => {
    console.log("MongoDB connected")
    app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
}).catch((err) => {
    console.log("MongoDB connection failed",err)
})








app.use('/', (err, req, res,next) => { //express error middle ware
  // res.status(200).json({ message: "Root endpoint" });
  if(err){
    res.status(500).json({ message: "Internal Server Error" });
  }
});






