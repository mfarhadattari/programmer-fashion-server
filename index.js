const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");

const app = express();
const port = process.env.PORT || 3000;

// ! Middleware
app.use(cors());
app.use(express.json());

// ! Route Import
const publicRoute = require("./routers/public");
const othersRoute = require("./routers/others");

const client = new MongoClient(process.env.MONGODB_URI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    client.connect();
    //! Code here
    const db = client.db("programmer-fashion");

    // !Collection Middleware
    app.use((req, res, next) => {
      req.productCollection = db.collection("products");
      req.testimonialCollection = db.collection("testimonials");
      req.teamCollection = db.collection("our-teams");
      req.productReviewCollection = db.collection("products-reviews");
      req.orderCollection = db.collection("orders");
      req.userCollection = db.collection("users");
      next();
    });

    // ! Router Middleware
    app.use("/", publicRoute);
    app.use("/", othersRoute)

    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Programmer Fashion Server is Running");
});

app.listen(port, () => {
  console.log(`Programmer Fashion Server is Running on port ${port}`);
});
