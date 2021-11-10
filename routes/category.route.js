const express = require("express");
const {
	createCategory,
	getAllCategories,
} = require("../controllers/category.controller");
const router = express.Router();

router.post("/category/create", createCategory);
router.get("/category/getCategory", getAllCategories);

module.exports = router;
