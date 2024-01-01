const mongoose = require("mongoose");

const connectDB = async () => {
	const conn = await mongoose
		.connect(process.env.MONGO_URL)
		.then((res) => console.log(`MongoDB Connected: ${res.connection.host}`))
		.catch((err) => console.log(err));
};

module.exports = connectDB;
