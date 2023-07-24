const express = require("express");
const { jwtVerify, adminVerify } = require("../middlewares/middlewares");
const router = express.Router();
const {ObjectId} = require("mongodb")

router.get("/all-products", jwtVerify, adminVerify, async (req, res) => {
  const productCollection = req.productCollection;
  const products = await productCollection
    .find()
    .sort({ timeData: -1 })
    .toArray();
  res.send(products);
});

router.delete("/delete-product/:id", jwtVerify, adminVerify, async (req, res) => {
  const productCollection = req.productCollection;
  const query = { _id: new ObjectId(req.params.id) };
  const deletedResult = await productCollection.deleteOne(query);
  res.send(deletedResult);
});

module.exports = router;
