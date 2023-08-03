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

// !---------------- Product Reviews ---------------
router.get("/product-reviews/:id", async (req, res) => {
  const productReviewCollection = req.productReviewCollection;
  const id = req.params.id;
  const productReviews = await productReviewCollection
    .find({
      productID: id,
    })
    .sort({ timeDate: -1 })
    .limit(12)
    .toArray();
  res.send(productReviews.reverse());
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
    { $unwind: "$products" },
    { $group: { _id: "$products.productId", count: { $sum: 1 } } },
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
  const ourTeams = await teamCollection.find({}, {projection: {_id: 1, name: 1, image: 1, position: 1}}).toArray();
  res.send(ourTeams);
});

module.exports = router;
