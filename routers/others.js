const express = require("express");
const router = express.Router();

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

module.exports = router;
