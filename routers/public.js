const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

// TODO: Testimonial and product with pagination and limit

// ! --------------- All Products -----------------------
router.get("/products", async (req, res) => {
  const productCollection = req.productCollection;
  const products = await productCollection.find().toArray();
  res.send(products);
});

// ! ------------------ Products Details ---------------
router.get("/products/:id", async (req, res) => {
  const productCollection = req.productCollection;
  const id = req.params.id;
  const product = await productCollection.findOne({ _id: new ObjectId(id) });
  res.send(product);
});

// ! ---------------- New Products --------------------
router.get("/new-products", async (req, res) => {
  const productCollection = req.productCollection;
  const newProducts = await productCollection
    .find({})
    .sort({ timeDate: -1 })
    .limit(6)
    .toArray();

  res.send(newProducts);
});

// ! ----------------- Popular Products -----------------
router.get("/popular-products", async (req, res) => {
  const orderCollection = req.orderCollection;
  const productCollection = req.productCollection;
  const aggregatePipelines = [
    { $group: { _id: "$productsID" } },
    { $sort: { count: -1 } },
    { $limit: 6 },
  ];
  const productsIDs = await orderCollection
    .aggregate(aggregatePipelines)
    .toArray();
  const ids = productsIDs.map((item) => new ObjectId(item._id));
  const popularProducts = await productCollection
    .find({ _id: { $in: ids } })
    .toArray();
  res.send(popularProducts);
});

// !---------------------- Testimonials -----------------
router.get("/testimonials", async (req, res) => {
  const testimonialCollection = req.testimonialCollection;
  const userReviews = await testimonialCollection.find().toArray();
  res.send(userReviews);
});

// !------------------- our teams info ------------------
router.get("/our-teams", async (req, res) => {
  const teamCollection = req.teamCollection;
  const ourTeams = await teamCollection.find().toArray();
  res.send(ourTeams);
});

module.exports = router;
