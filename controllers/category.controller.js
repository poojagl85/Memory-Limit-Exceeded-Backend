const Category = require("../models/category.model");
const slugify = require("slugify");

exports.createCategory = async (req, res) => {
	try {
		const catObj = {
			name: req.body.name,
			slug: slugify(req.body.name),
		};
		const category = new Category(catObj);

		const _category = await category.save();

		return res.status(200).json({
			message: "Category created...!",
			category: {
				_category,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

exports.getAllCategories = async (req, res) => {
	try {
		const categories = await Category.find({});
		console.log(categories);
		return res.status(200).json({
			categories: {
				categories,
			},
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
