const jwt = require("jsonwebtoken");

//VERIFY TOKEN
const verifyToken = (req, res, next) => {
	//check request header for key "token"
	const authHeader = req.headers.token;
	if (authHeader) {
		const token = authHeader.split(" ")[1];
		//verify token & return (error, decoded_data = user)
		jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
			if (err) res.status(403).json("Token is not valid!");
			//create a new property "user" in the request object to store user
			req.user = user;
			next();
		});
	} else {
		return res.status(401).json("You are not authenticated!");
	}
};

//VERIFY TOKEN AND AUTHORIZE USER'S ACTION
const verifyTokenAndAuthorization = (req, res, next) => {
	//check if user is authenticated
	verifyToken(req, res, () => {
		//check JWT token if user is authorized
		if (req.user.id === req.params.id || req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("You are not alowed to do that!");
		}
	});
};

//VERIFY TOKEN AND AUTHORIZE ADMIN'S ACTION ONLY
const verifyTokenAndAdmin = (req, res, next) => {
	//check if user is authenticated
	verifyToken(req, res, () => {
		//check JWT token if user is authorized
		if (req.user.isAdmin) {
			next();
		} else {
			res.status(403).json("You are not alowed to do that!");
		}
	});
};

module.exports = { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin };
