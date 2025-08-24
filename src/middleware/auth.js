const handler = (req, res, next) => {
  const yes = true;
  if(yes===true){
    next();
  }else{
    res.status(400).json({ message: "User creation failed" });
  }
};

module.exports = handler;