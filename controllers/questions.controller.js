const Question = require("../models/questions.model");
const Category = require("../models/category.model");
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
						const { title, description, categoryId } = req.body;
						const slug = slugify(title);

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
									activityId: _question._id,
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

		const skip = (pageNumber - 1) * 10;
		const user = await User.findById(req.query.id);

		const questions = await Question.find({ categoryId: user.categoryId })
			.skip(skip)
			.limit(10)
			.populate("authorID");
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
	const name = req.query.search;
	if (name === '') return res.status(200).json({
		questions: [],
	});
	const pageNumber = req.query.page;
	const skip = (pageNumber - 1) * 10;
	var regex = new RegExp(name, "i");
	Question.find({ description: regex, title: regex })
		.skip(skip)
		.limit(10)
		.then((result) => {
			// console.log(result);
			return res.status(200).json({
				questions: result,
			});
		})
		.catch((err) => {
			console.log(err);
			return res.status(500).json({
				error: "Internal Server Error",
			});
		});
};
