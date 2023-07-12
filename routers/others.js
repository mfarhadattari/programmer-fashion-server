const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { jwtVerify } = require("../middlewares/middlewares");

// !------------------ Create User ---------------------
router.post("/create-user", async (req, res) => {
  const userCollection = req.userCollection;
  const data = req.body;
  const alreadyExist = await userCollection.findOne({ email: data.email });
  if (alreadyExist) {
    return res.send({ insertedId: alreadyExist._id });
  }
  const result = await userCollection.insertOne(data);
  res.send(result);
});

// !------------------ Get User ---------------------
router.get("/get-user", jwtVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const email = req.query.email;
  if (email !== req.decoded.email) {
    return res.status(403).send({ error: true, message: "Access Forbidden" });
  }
  const result = await userCollection.findOne({ email });
  res.send(result);
});

// !------------------- Generate JWT Token -------------------
router.post("/generate-jwt", async (req, res) => {
  const data = req.body;
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({ token });
});

// ! ------------------ Update User Info -------------------
router.patch("/update-info", jwtVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const query = { email: req.decoded.email };
  const data = req.body;
  const updateDoc = {
    $set: {
      ...data,
    },
  };
  const updateResult = await userCollection.updateOne(query, updateDoc);
  res.send(updateResult);
});

module.exports = router;
