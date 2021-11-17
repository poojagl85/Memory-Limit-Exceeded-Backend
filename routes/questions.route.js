const express = require("express");
const {
	postQuestion,
	getQuestions,
	getQuestionDetail,
} = require("../controllers/questions.controller");
const { addSolution } = require("../controllers/solution.controller");
const router = express.Router();
const { requireSignin } = require("../middlewares/index");
const { verifyContent } = require("../middlewares/moderator");

router.post("/question/create", requireSignin, postQuestion);
router.get("/getquestions", requireSignin, getQuestions);
router.get("/question", getQuestionDetail);
router.post("/:id/addSolution", requireSignin, addSolution);
// router.post("/search", requireSignin, searchQuestion);

module.exports = router;
