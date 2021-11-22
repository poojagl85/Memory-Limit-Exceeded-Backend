const Question = require("../models/questions.model");
const Category = require("../models/category.model");
const Solution = require("../models/solution.model");
const User = require("../models/user.model");
const slugify = require("slugify");
const { promisify } = require("util");
require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");


const threshold = 0.9;

const getMaliciousPredictions = (predictions, onSuccess, onError) => {
	for (let prediction of predictions) {
		if (prediction.results[0].match === true) {
			onError({
				msg: `Your solution/question could not be posted as it consisted of content falling in ${prediction.label} category.`,
			});
			return;
		}
	}
	onSuccess({ msg: `Passed...!` });
};

getMaliciousPredictions[promisify.custom] = (predictions) => {
	return new Promise((resolve, reject) => {
		getMaliciousPredictions(
			predictions,
			(onSuccess) => resolve(onSuccess),
			(onError) => reject(onError)
		);
	});
};

exports.postQuestion = async (req, res) => {
	try {
		await toxicity.load(threshold).then((model) => {
			const sentences = [req.body.description];

			model.classify(sentences).then((predictions) => {
				const maliciousPredictions = promisify(getMaliciousPredictions);
				maliciousPredictions(predictions)
					.then(async (result) => {
						const { title, description, category } = req.body;
						const slug = slugify(title);

						let _category = await Category.findOne({ name: category })

						if (!_category) {
							const catObj = {
								name: category,
								slug: slugify(category),
							};
							_category = await new Category(catObj).save();
						}

						const categoryId = _category._id;


						const question = new Question({
							title,
							slug,
							description,
							categoryId,
							authorID: req.user._id,
						});

						const _question = await question.save();
						const userId = _question.authorID;

						const _cat = await Category.updateOne(
							{ _id: categoryId },
							{
								$push: {
									questionId: _question._id,
								},
							}
						);

						const _user = await User.updateOne(
							{ _id: userId },
							{
								$push: {
									questionId: _question._id,
								},
							}
						);

						return res.status(200).json({
							message: `Question posted...!`,
							question: {
								_question,
							},
						});
					})
					.catch((err) => {
						console.log(err);
						return res.status(403).json({
							message: err.msg,
						});
					});
			});
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
		const limit = 15;

		const skip = (pageNumber - 1) * 10;
		const user = await User.findById(req.query.id);
		console.log(user);

		const query = req.query.query;
		let questions = [];
		if (query === "none") {
			questions = await Question.find({ categoryId: user.categoryId })
				.skip(skip)
				.limit(limit)
				.populate("authorID", "email fullName _id username");
		} else {
			const value = req.query.value;
			if (query === "createdAt") {

				questions = await Question.find({ categoryId: user.categoryId })
					.sort({ createdAt: value })
					.skip(skip)
					.limit(limit)
					.populate("authorID", "email fullName _id username");
			} else {
				questions = await Question.aggregate(
					[
						{
							$match: {
								categoryId: {
									$in: user.categoryId
								}
							},

						},
						{
							$project: {
								title: 1,
								slug: 1,
								description: 1,
								authorID: 1,
								categoryId: 1,
								solutionId: 1,
								createdAt: 1,
								answerLength: { $size: "$solutionId" },
							},
						},
						{ $sort: { answerLength: parseInt(value) } },
						{ $skip: skip },
						{ $limit: limit },
					],

				)
				await Question.populate(questions, { path: 'authorID', select: "fullName email _id username" })
			}
		}
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

exports.getQuestionDetail = async (req, res) => {
	try {
		const slug = req.query.slug;
		const question = await Question.findOne({ slug: slug })
			.populate("authorID", "fullName email username")
			.populate({
				path: "solutionId",
				populate: {
					path: "authorID",
					select: "fullName email username",
				},
			})
			.populate("categoryId");

		return res.status(200).json({
			question,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};

exports.searchQuestion = async (req, res) => {
	try {

		const name = req.query.search;
		if (name === "")
			return res.status(200).json({
				results: [],
			});
		const pageNumber = req.query.page;
		const skip = (pageNumber - 1) * 10;
		var regex = new RegExp(name, "i");
		let ques = [];
		let cat = [];
		await Question.find({ description: regex, title: regex }, { title: 1, description: 1, slug: 1, type: "question" })
			.skip(skip)
			.limit(10)
			.then((result) => {
				ques = result
			})
		await Category.find({ name: regex }, { name: 1, slug: 1, type: "category" }).skip(skip)
			.limit(10).then((res) => {
				cat = res
			})
		const results = ques.concat(cat);

		return res.status(200).json({
			results: results
		})
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}



};
