const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");

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

		const { fullName, email, password, categoryId } = req.body;

		const _user = new User({
			fullName,
			email,
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
			message: "Internal Server Error",
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
					JWT_SECRET,
					{
						expiresIn: "10d",
					}
				);



				res.cookie("token", token, { secure: true });

				return res.status(200).json({
					message: "Signin successful..!",
					user
				});
			} else {
				return res.status(400).json({
					message: `Email and password combination doesn't match`,
				});
			}
		} else {
			return res.status(400).json({
				message: `User doesn't exists`,
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
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
			message: "Internal Server Error",
		});
	}

}

exports.getUserQuestionFeed = async (req, res) => {
	try {

		const userId = req.user._id;
		const user = await User.findById(userId, "questionId").populate("questionId", "title description slug createdAt solutionId");

		return res.status(200).json({
			user: user
		})


	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
}

exports.getUserSolutionFeed = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId, "solutionId").populate({
			path: 'solutionId',
			select: 'description createdAt questionId commentsId', populate: {
				path: 'questionId',
				select: "title description slug"
			}
		})

		return res.status(200).json({
			user
		})

	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
}

exports.getUserCommentFeed = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId, "commentId").populate({
			path: 'commentId',
			select: 'description createdAt solutionId', populate: {
				path: 'solutionId',
				select: "description questionId", populate: {
					path: 'questionId',
					select: "slug"
				}
			}
		})

		return res.status(200).json({
			user
		})
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
}

exports.getUserInfo = async (req, res) => {
	try {
		const userId = req.user._id;
		const user = await User.findById(userId)
		return res.status(200).json({
			user
		})
	} catch (error) {
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
}
