require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtVerify = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized Access" });
  }
  const token = authorization.split(" ")[1];
  if (!token) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized Access" });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ error: true, ...err });
    }
    req.decoded = decoded;
    next();
  });
};

const adminVerify = async (req, res, next) => {
  const userCollection = req.userCollection;
  const query = { email: req.decoded.email };
  const user = await userCollection.findOne(query);
  if (!user) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized Access" });
  }
  const isAdmin = user?.role === "admin";
  if (!isAdmin) {
    return res
      .status(401)
      .send({ error: true, message: "Unauthorized Access" });
  }
  next();
};

module.exports = { jwtVerify, adminVerify };
