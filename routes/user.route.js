const express = require("express");
const { signin, signup, signout, getUserQuestionFeed } = require("../controllers/user.cotroller");
const router = express.Router();
const {
	validateSignupRequest,
	isRequestValidated,
} = require("../validators/user");
const { requireSignin } = require("../middlewares/index");

router.post("/signup", validateSignupRequest, isRequestValidated, signup);
router.post("/signin", signin);
router.post("/signout", signout);
router.get("/user/questions", requireSignin, getUserQuestionFeed)

module.exports = router;
