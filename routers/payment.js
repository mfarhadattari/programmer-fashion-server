const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();
const SSLCommerzPayment = require("sslcommerz-lts");
const storeID = process.env.STORE_ID;
const storePASS = process.env.STORE_PASS;
const isLive = false;
const url = "http://localhost:3000";

router.post("/initialize-payment", async (req, res) => {
  const orderCollection = req.orderCollection;
  const tran_id = new ObjectId().toString();
  const {
    email,
    phone,
    name,
    totalAmount,
    postCode,
    city,
    address,
    products,
    timeDate,
  } = req.body;
  const data = {
    total_amount: totalAmount,
    currency: "BDT",
    tran_id: tran_id,
    success_url: `${url}/payment-success/${tran_id}`,
    fail_url: "http://localhost:3030/fail",
    cancel_url: "http://localhost:3030/cancel",
    ipn_url: "http://localhost:3030/ipn",
    shipping_method: "Yes",
    product_name: "Product Name",
    product_category: "Product Category",
    product_profile: "general",
    cus_name: name,
    cus_email: email,
    cus_add1: address,
    cus_city: city,
    cus_postcode: postCode,
    cus_country: "Bangladesh",
    cus_phone: phone,
    ship_name: name,
    ship_add1: address,
    ship_city: city,
    ship_postcode: postCode,
    ship_country: "Bangladesh",
  };

  const sslcz = new SSLCommerzPayment(storeID, storePASS, isLive);
  sslcz.init(data).then((apiResponse) => {
    let GatewayPageURL = apiResponse.GatewayPageURL;
    res.send({ url: GatewayPageURL });
  });

  const OrderInfo = {
    email,
    phone,
    name,
    totalAmount,
    tran_id,
    postCode,
    city,
    address,
    products,
    timeDate,
    status: "Unpaid",
  };
  const addOrder = await orderCollection.insertOne(OrderInfo);
});

// ! Payment Success
router.post("/payment-success/:tran_id", async (req, res) => {
  const orderCollection = req.orderCollection;
  const cartCollection = req.cartCollection;
  const paymentCollection = req.paymentCollection;
  const tran_id = req.params.tran_id;
  //   Update Payment Status
  const updateStatus = {
    $set: {
      status: "Paid",
    },
  };
  const updateResult = await orderCollection.updateOne(
    { tran_id },
    updateStatus
  );

  const order = await orderCollection.findOne({ tran_id });

  //   Save in payment Collection
  const paymentInfo = {
    email: order.email,
    name: order.name,
    timeDate: order.timeDate,
    amount: order.totalAmount,
    tran_id,
  };
  const addPayment = await paymentCollection.insertOne({ paymentInfo });

  //   delete from cart
  const cartIds = order.products.map((item) => new ObjectId(item.cartId));
  const deleteCart = await cartCollection.deleteMany({ _id: { $in: cartIds } });
  console.log(deleteCart);

  res.redirect("http://localhost:5173/payment-success");
});

module.exports = router;
