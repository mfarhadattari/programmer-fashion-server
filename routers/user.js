const express = require("express");
const { jwtVerify } = require("../middlewares/middlewares");
const router = express.Router();

//! Add to cart
router.post("/add-to-cart", jwtVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const cartInfo = req.body;
  const query = {
    productID: cartInfo.productID,
    email: cartInfo.email,
  };
  const alreadyAdded = await cartCollection.findOne(query);
  if (alreadyAdded) {
    const updateCart = {
      $set: {
        quantity: alreadyAdded.quantity + 1,
        price: cartInfo.price,
        timeDate: cartInfo.timeDate,
      },
    };
    const updateResult = await cartCollection.updateOne(query, updateCart);
    return res.send(updateResult);
  }
  const addResult = await cartCollection.insertOne(cartInfo);
  res.send(addResult);
});

// ! TOTAL CART
router.get("/total-cart", jwtVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const query = { email: req.decoded.email };
  const totalCart = await cartCollection.countDocuments(query);
  res.send({ totalCart: totalCart });
});

// !My Cart
router.get("/my-cart", jwtVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const query = { email: req.decoded.email };
  const myCart = await cartCollection
    .find(query)
    .sort({ timeDate: -1 })
    .toArray();
  res.send(myCart);
});

module.exports = router;
