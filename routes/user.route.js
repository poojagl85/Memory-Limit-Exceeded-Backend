const express = require("express");
const { signin, signup } = require("../controllers/user.cotroller");
const router = express.Router();
const {
	validateSignupRequest,
	isRequestValidated,
} = require("../validators/user");

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", signin);

module.exports = router;
