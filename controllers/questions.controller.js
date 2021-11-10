const Question = require("../models/questions.model");
const Category = require("../models/category.model");
const User = require("../models/user.model");
const slugify = require("slugify");

exports.postQuestion = async (req, res) => {
	try {
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

		for (let cat of categoryId) {
			const _cat = await Category.updateOne(
				{ _id: cat },
				{
					$push: {
						questionId: _question._id,
					},
				}
			);
		}

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
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
