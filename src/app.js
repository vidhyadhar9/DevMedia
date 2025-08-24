const express = require('express');
const handler = require('./middleware/auth');

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



const handler2 = (req, res,next) => {
  // Perform additional logic here
    throw new Error("Custom error from handler2"); 
  
};



app.post("/user",handler,handler2)



app.use('/', (err, req, res,next) => { //express error middle ware
  // res.status(200).json({ message: "Root endpoint" });
  if(err){
    res.status(500).json({ message: "Internal Server Error" });
  }
});






