const User = require("../models/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const bcrypt = require("bcrypt");

//UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
	//encrypt password
	if (req.body.password) {
		//hash & salt password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
	}
	try {
		//update user
		const updatedUser = await User.findByIdAndUpdate(
			req.params.id,
			{
				$set: req.body,
			},
			{ new: true }
		);
		res.status(200).json(updatedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//DELETE USER
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
	try {
		await User.findByIdAndDelete(req.params.id);
		res.status(200).json("User has been deleted...");
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, ...others } = user._doc;
		res.status(200).json(others);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET ALL USERS
router.get("/", verifyTokenAndAdmin, async (req, res) => {
	//query "new" to get latest users
	const query = req.query.new;
	try {
		//if query "new" is true, return last 5 users
		const users = query ? await User.find().sort({ _id: -1 }).limit(5) : await User.find();
		res.status(200).json(users);
	} catch (err) {
		res.status(500).json(err);
	}
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
	const date = new Date();
	const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
	try {
		const data = await User.aggregate([
			//match: find user created >= last year
			{ $match: { createdAt: { $gte: lastYear } } },
			//$group: group by month, with respective total number of users *MUST HAVE _id field
			{
				$group: {
					_id: {
						year: { $year: "$createdAt" },
						month: { $month: "$createdAt" },
					},
					total: { $sum: 1 },
				},
			},
			//$project: return only $month field
			{
				$project: {
					date: "$_id",
					total: 1,
				},
			},
			//$sort: sort by date
			{ $sort: { date: 1 } },
		]);

		res.status(200).json(data);
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
