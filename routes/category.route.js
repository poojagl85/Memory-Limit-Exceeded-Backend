const express = require("express");
const {
	createCategory,
	getAllCategories,
	getCategoryDetail,
} = require("../controllers/category.controller");
const router = express.Router();

router.post("/category/create", createCategory);
router.get("/category/getCategory", getAllCategories);
router.get("/category", getCategoryDetail);


module.exports = router;
