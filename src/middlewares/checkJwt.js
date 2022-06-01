const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkJwt = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).json();
  }
  try {
    jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
    return next();
  } 
  catch (err) {
    return res.status(401).json();
  }
};

module.exports = checkJwt;