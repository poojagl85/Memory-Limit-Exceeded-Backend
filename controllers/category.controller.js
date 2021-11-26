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
			message: "Internal Server Error",
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
			message: "Internal Server Error",
		});
	}
};

exports.getCategoryDetail = async (req, res) => {
	try {
		const slug = req.query.slug;
		const questions = await Category.find(
			{ slug: slug },
			{ questionId: 1, slug: 1 }
		).populate({
			path: "questionId",
			select: "title description authorID createdAt slug solutionId",
			populate: { path: "authorID", select: "fullName email" },
		});

		return res.status(200).json({
			questions: questions[0].questionId,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
