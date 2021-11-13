const express = require("express");
const {
	createFakeUser,
	createQuestion,
	addSolution,
} = require("../controllers/faker.controller");
const router = express.Router();

router.get("/fake/create", createFakeUser);
router.get("/fake/createquestion", createQuestion);
router.get("/fake/createsolution", addSolution);

module.exports = router;
