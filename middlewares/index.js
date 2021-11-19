const jwt = require("jsonwebtoken");

exports.requireSignin = (req, res, next) => {
	if (req.headers.cookie) {
		const token = req.headers.cookie.split("=")[1];
		const user = jwt.verify(token, process.env.JWT_SECRET);
		req.user = user;
	} else {
		return res.status(400).json({
			message: "Authorization required",
		});
	}

	next();
};

