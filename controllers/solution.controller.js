const Solution = require("../models/solution.model");
const Question = require("../models/questions.model");
const User = require("../models/user.model");

exports.addSolution = async (req, res) => {
	try {
		const { description, questionId } = req.body;
		const authorID = req.user._id;

		const solution = new Solution({
			description,
			questionId,
			authorID,
		});

		const _solution = await solution.save();

		const _question = await Question.updateOne(
			{ _id: questionId },
			{
				$push: {
					solutionId: _solution._id,
				},
			}
		);

		const _user = await User.updateOne(
			{ _id: authorID },
			{
				$push: {
					activityId: _solution._id,
				},
			}
		);

		return res.status(200).json({
			message: `Solution added... !`,
			solution: _solution,
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			error: "Internal Server Error",
		});
	}
};
