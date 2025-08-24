const express = require('express');
const handler = require('./middleware/auth');

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});



const handler2 = (req, res) => {
  // Perform additional logic here
  res.status(200).json({ message: "Additional handler executed" });
  console.log("handler2 executed");
};

app.post("/user",handler,handler2)


