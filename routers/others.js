const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

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

// !------------------- Generate JWT Token -------------------
router.post("/generate-jwt", async (req, res) => {
  const data = req.body;
  const token = jwt.sign(data, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.send({ token });
});

module.exports = router;
