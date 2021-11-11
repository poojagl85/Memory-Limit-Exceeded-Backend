const express = require("express");
const { postQuestion } = require("../controllers/questions.controller");
const { addSolution } = require("../controllers/solution.controller");
const router = express.Router();
const { requireSignin } = require("../middlewares/index");

router.post("/question/create", requireSignin, postQuestion);

router.post("/:slug/addSolution", requireSignin, addSolution);

module.exports = router;
