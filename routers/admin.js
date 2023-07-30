const express = require("express");
const { jwtVerify, adminVerify } = require("../middlewares/middlewares");
const router = express.Router();
const { ObjectId } = require("mongodb");

// ! admin overview api
router.get("/overview", jwtVerify, adminVerify, async (req, res) => {
  const productCollection = req.productCollection;
  const userCollection = req.userCollection;
  const paymentCollection = req.paymentCollection;
  const orderCollection = req.orderCollection;
  const cartCollection = req.cartCollection;

  const totalProduct = await productCollection.estimatedDocumentCount();
  const totalCustomer = await userCollection.countDocuments({
    role: { $exists: false },
  });
  const totalCart = await cartCollection.estimatedDocumentCount();

  // payment info
  const paymentPipeline = [
    {
      $group: {
        _id: "$month",
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        totalAmount: 1,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ];
  const paymentInfo = await paymentCollection
    .aggregate(paymentPipeline)
    .toArray();

  // Order info
  const orderPipeline = [
    {
      $group: {
        _id: "$month",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        month: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        month: 1,
      },
    },
  ];
  const OrderInfo = await orderCollection.aggregate(orderPipeline).toArray();

  res.send({ totalProduct, totalCustomer, totalCart, paymentInfo, OrderInfo });
});

// ! get all product api
router.get("/all-products", jwtVerify, adminVerify, async (req, res) => {
  const productCollection = req.productCollection;
  const products = await productCollection
    .find()
    .sort({ timeDate: -1 })
    .toArray();
  res.send(products);
});

// ! delete a product api
router.delete(
  "/delete-product/:id",
  jwtVerify,
  adminVerify,
  async (req, res) => {
    const productCollection = req.productCollection;
    const query = { _id: new ObjectId(req.params.id) };
    const deletedResult = await productCollection.deleteOne(query);
    res.send(deletedResult);
  }
);

// ! add a product api
router.post("/add-product", jwtVerify, adminVerify, async (req, res) => {
  const productCollection = req.productCollection;
  const data = req.body;
  const insertResult = await productCollection.insertOne(data);
  res.send(insertResult);
});

// ! update a product api
router.patch(
  "/update-product/:id",
  jwtVerify,
  adminVerify,
  async (req, res) => {
    const productCollection = req.productCollection;
    const query = { _id: new ObjectId(req.params.id) };
    const data = req.body;
    const updateDoc = {
      $set: {
        ...data,
      },
    };
    const updatedResult = await productCollection.updateOne(query, updateDoc);
    res.send(updatedResult);
  }
);

// ! all customer api
router.get("/all-customer", jwtVerify, adminVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const allUser = await userCollection.find().toArray();
  const allCustomer = allUser.filter((user) => !user.role);
  res.send(allCustomer.reverse());
});

// ! customer details api
router.get("/customer", jwtVerify, adminVerify, async (req, res) => {
  const userCollection = req.userCollection;
  const orderCollection = req.orderCollection;
  const cartCollection = req.cartCollection;
  const paymentCollection = req.paymentCollection;
  const query = { email: req.query.email };
  const userInfo = await userCollection.findOne(query);
  const orderInfo = await orderCollection
    .find(query, {
      sort: { timeDate: -1 },
      projection: {
        _id: 1,
        totalAmount: 1,
        timeDate: 1,
        products: 1,
        status: 1,
      },
    })
    .toArray();
  const cartInfo = await cartCollection
    .find(query, { sort: { timeDate: -1 }, projection: { email: 0 } })
    .toArray();
  const paymentInfo = await paymentCollection
    .find(query, {
      sort: { timeDate: -1 },
      projection: { email: 0, name: 0, month: 0 },
    })
    .toArray();

  res.send({ userInfo, orderInfo, cartInfo, paymentInfo });
});

// ! all order api
router.get("/all-order", jwtVerify, adminVerify, async (req, res) => {
  const orderCollection = req.orderCollection;
  const allOrder = await orderCollection
    .find()
    .sort({ timeDate: -1 })
    .toArray();
  res.send(allOrder);
});

// ! approve order api
router.patch("/approve-order/:id", jwtVerify, adminVerify, async (req, res) => {
  const orderCollection = req.orderCollection;
  const query = { _id: new ObjectId(req.params.id) };
  const approveOrderDoc = {
    $set: {
      status: "Approve",
    },
  };
  const approveResult = await orderCollection.updateOne(query, approveOrderDoc);
  res.send(approveResult);
});

// ! all payment api
router.get("/all-payment", jwtVerify, adminVerify, async (req, res) => {
  const paymentCollection = req.paymentCollection;
  const allPayments = await paymentCollection
    .find()
    .sort({ timeDate: -1 })
    .toArray();
  res.send(allPayments);
});

module.exports = router;
