const express = require("express");
const { ObjectId } = require("mongodb");
const router = express.Router();

router.get("/products", async (req, res) => {
  const productCollection = req.productCollection;
  const products = await productCollection.find().toArray();
  res.send(products);
});

router.get("/products/:id", async (req, res) => {
  const productCollection = req.productCollection;
  const id = req.params.id;
  const product = await productCollection.findOne({ _id: new ObjectId(id) });
  res.send(product);
});

router.get("/testimonials", async (req, res) => {
  const testimonialCollection = req.testimonialCollection;
  const userReviews = await testimonialCollection.find().toArray();
  res.send(userReviews);
});

router.get("/our-teams", async (req, res) => {
  const teamCollection = req.teamCollection;
  const ourTeams = await teamCollection.find().toArray();
  res.send(ourTeams);
});

module.exports = router;
