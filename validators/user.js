const { check, validationResult } = require("express-validator");

exports.validateSignupRequest = [
	check("fullName").notEmpty().withMessage("Name is required"),
	check("email").isEmail().withMessage("Valid email is required"),
	check("categoryId").isArray({ min: 3 }).withMessage("Atleast 3 categories are required"),
	check("password")
		.matches("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])")
		.withMessage("Password must have atleast 8 characters including 1 lowercase, 1 uppercase, 1 numeric, and 1 special character."),
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
