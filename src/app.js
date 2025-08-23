const express = require('express');

const app = express();
app.use(express.json());

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

app.use("/test", (req, res) => {
  res.send("Test endpoint");
});