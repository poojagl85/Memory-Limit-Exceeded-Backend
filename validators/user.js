const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
	check("fullName").notEmpty().withMessage("Name is required"),
	check("email").isEmail().withMessage("Valid email is required"),
	check("categoryId").isArray({ min: 3 }).withMessage("Atleast 3 categories are required"),
	check("password")
		.isLength({ min: 8 })
		.withMessage("Password must be 8 characters long")
		.matches(/\d/)
		.withMessage("Password must contain a number"),
];

exports.isRequestValidated = (req, res, next) => {
	const errors = validationResult(req);
	console.log(errors);
	if (errors.array().length > 0) {
		return res.status(400).json({
			message: errors.array()[0].msg,
		});
	}
	next();
};
