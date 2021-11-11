const Category = require("../models/category.model");
const slugify = require("slugify");
const Question = require("../models/questions.model");

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

exports.getQuestions = async (req, res) => {
	try {
		const pageNumber = req.query.page;

		const skip = (pageNumber - 1) * 10;

		const questions = await Question.find({})
			.skip(skip)
			.limit(10)
			.populate("authorID");
		console.log(questions);
		return res.status(200).json({
			questions,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
