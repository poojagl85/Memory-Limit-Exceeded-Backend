const express = require("express");
const { requireSignin } = require("../middlewares/index");
const {
	createCategory,
	getAllCategories,
	getQuestions,
} = require("../controllers/category.controller");
const router = express.Router();

router.post("/category/create", createCategory);
router.get("/category/getCategory", getAllCategories);
router.get("/getquestions", requireSignin, getQuestions);

module.exports = router;
