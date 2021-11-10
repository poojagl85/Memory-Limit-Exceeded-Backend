const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
	check("fullName").notEmpty().withMessage("Name is required"),
	check("email").isEmail().withMessage("Valid email is required"),
	check("username").notEmpty().withMessage("Username is required"),
	check("categoryId")
		.isArray()
		.isLength({ min: 3 })
		.withMessage("Categories are required"),
	check("password")
		.isLength({ min: 5 })
		.withMessage("Password must be 5 characters long")
		.matches(/\d/)
		.withMessage("must contain a number"),
];

exports.isRequestValidated = (req, res, next) => {
	const errors = validationResult(req);
	console.log(errors);
	if (errors.array().length > 0) {
		return res.status(400).json({
			errors: errors.array()[0].msg,
		});
	}
	next();
};
