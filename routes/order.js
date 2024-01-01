const { default: mongoose } = require("mongoose");
const Order = require("../models/Order");
const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin, verifyToken } = require("./verifyToken");
const router = require("express").Router();

//CREATE ORDER
router.post("/", verifyToken, async (req, res) => {
	const newOrder = new Order(req.body);
	try {
		const savedOrder = await newOrder.save();
		res.status(200).json(savedOrder);
	} catch (err) {
		res.status(500).json(err);
	}
});

//UPDATE ORDER
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		//update Order
		const updatedOrder = await Order.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedOrder);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE ORDER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		await Order.findByIdAndDelete(req.params.id);
		res.status(200).json("Order has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET USER ORDERS
router.get("/find/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		const orders = await Order.findById(req.params.id);
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL ORDERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	try {
		const orders = await Order.find().populate("userId");
		res.status(200).json(orders);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmin, async (req, res) => {
	const productId = req.query.pid ? new mongoose.Types.ObjectId(req.query.pid) : null;
	//Get previous Month of day1
	const date = new Date();
	date.setDate(1);
	const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
	lastMonth.setDate(1);
	const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));
	previousMonth.setDate(1);

	//Get previous Year
	const date2 = new Date();
	const lastYear = new Date(date2.setFullYear(date2.getFullYear() - 1));

	//match condition
	const match = productId
		? {
				createdAt: { $gte: lastYear },
				...(productId && { products: { $elemMatch: { _id: { $eq: productId } } } }),
		  }
		: {
				createdAt: { $gte: lastMonth },
		  };

	try {
		const income = await Order.aggregate([
			//match: find order created >= previous month
			{
				$match: match,
			},
			//$group: group by month, with respective total sales
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
					},
					total: { $sum: "$amount" },
				},
			},
			//$project: return month and sales field
			// {
			// 	$project: {
			// 		date: "$_id",
			// 		sales: "$total",
			// 	},
			// },
			//$sort: sort by date
			{ $sort: { _id: 1 } },
		]);

		res.status(200).json(income);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
