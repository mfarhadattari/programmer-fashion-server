const express = require("express");
const { jwtVerify } = require("../middlewares/middlewares");
const { ObjectId } = require("mongodb");
const router = express.Router();

//! Add to cart
router.post("/add-to-cart", jwtVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const cartInfo = req.body;
  const query = {
    productID: cartInfo.productID,
    email: cartInfo.email,
    size: cartInfo.size,
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

// ! DELETE CART
router.delete("/delete-cart/:id", jwtVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const query = { _id: new ObjectId(req.params.id), email: req.decoded.email };
  const deleteResult = await cartCollection.deleteOne(query);
  res.send(deleteResult);
});

// !Update Cart Quantity
router.patch("/update-quantity/:id", jwtVerify, async (req, res) => {
  const cartCollection = req.cartCollection;
  const query = { _id: new ObjectId(req.params.id) };
  const { quantity } = req.body;
  const updateDoc = {
    $set: {
      quantity: quantity,
    },
  };
  const updatedResult = await cartCollection.updateOne(query, updateDoc);
  res.send(updatedResult);
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

// ! MY Orders
router.get("/my-orders", jwtVerify, async (req, res) => {
  const orderCollection = req.orderCollection;
  const query = { email: req.decoded.email };
  const myOrders = await orderCollection
    .find(query)
    .sort({ timeDate: -1 })
    .toArray();
  res.send(myOrders);
});

// ! MY Payments
router.get("/my-payments", jwtVerify, async (req, res) => {
  const paymentCollection = req.paymentCollection;
  const query = { email: req.decoded.email };
  const payments = await paymentCollection
    .find(query)
    .sort({ timeDate: -1 })
    .toArray();
  res.send(payments);
});

module.exports = router;
