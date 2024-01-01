const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config(); //.env ready to use
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const userRoute = require("./routes/user");
const authRoute = require("./routes/auth");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const cors = require("cors");

//Connect to database
connectDB();

app.use(cors());
app.use(express.json());

//Endpoint
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api/checkout", stripeRoute);

app.listen(process.env.PORT || 8800, () => {
	//where 8800 is our port number
	console.log("Backend server is running!");
});
