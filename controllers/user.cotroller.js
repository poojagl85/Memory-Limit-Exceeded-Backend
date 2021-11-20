const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
	try {
		const user = await User.findOne({
			email: req.body.email,
		});

		if (user) {
			return res.status(400).json({
				message: "User already exists",
			});
		}

		const { fullName, email, username, password, categoryId } = req.body;

		const _user = new User({
			fullName,
			email,
			username,
			password,
			categoryId,
		});

		const data = await _user.save();

		return res.status(200).json({
			message: `Signup successful...!`,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

exports.signin = async (req, res) => {
	try {
		const user = await User.findOne({
			email: req.body.email,
		});

		if (user) {
			if (user.authenticate(req.body.password)) {
				const token = jwt.sign(
					{
						_id: user._id,
					},
					process.env.JWT_SECRET,
					{
						expiresIn: "10d",
					}
				);

				const { _id, fullName, email, username } = user;

				res.cookie("token", token, { httpOnly: true });

				return res.status(200).json({
					message: "Signin successful..!",

					user: {
						_id,
						fullName,
						email,
						username,
					},
				});
			} else {
				return res.status(400).json({
					error: `Email and password combination doesn't match`,
				});
			}
		} else {
			return res.status(400).json({
				error: `User doesn't exists`,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};


exports.signout = async (req, res) => {

	try {
		res.clearCookie("token");

		return res.status(200).json({
			message: "Signout successful"
		})
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}

}
