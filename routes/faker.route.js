const express = require("express");
const {
	createFakeUser,
	createQuestion,
} = require("../controllers/faker.controller");
const router = express.Router();

router.get("/fake/create", createFakeUser);
router.get("/fake/createquestion", createQuestion);

module.exports = router;
