const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//REGISTER
router.post("/register", async (req, res) => {
	try {
		//hash & salt password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(req.body.password, salt);
		//take in username, email, password from req.body
		const newUser = new User({
			username: req.body.username,
			email: req.body.email,
			password: hashedPassword,
		});

		//save user to database
		const savedUser = await newUser.save();
		res.status(201).json(savedUser);
	} catch (err) {
		res.status(500).json(err);
	}
});

//LOGIN
router.post("/login", async (req, res) => {
	try {
		//check if user exists
		const user = await User.findOne({ username: req.body.username });
		if (!user) {
			return res.status(401).json("Wrong credentials");
		}
		//compare passwords
		const validated = await bcrypt.compare(req.body.password, user.password);
		if (!validated) {
			return res.status(401).json("Wrong password");
		}
		//send JWT
		const accessToken = jwt.sign(
			{
				id: user._id,
				isAdmin: user.isAdmin,
			},
			process.env.JWT_SECRET,
			{
				expiresIn: "3d",
			}
		);
		const { password, ...others } = user._doc;
		res.status(200).json({ ...others, accessToken });
	} catch (err) {
		res.status(500).json(err);
	}
});

module.exports = router;
