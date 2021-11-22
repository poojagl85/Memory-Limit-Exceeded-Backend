const mongoose = require("mongoose");

const solutionSchema = mongoose.Schema(
	{
		description: {
			type: String,
			required: true,
		},
		authorID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		questionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Question",
		},
		commentsId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Comment",
			},
		],
		upvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
		downvotes: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "User",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Solution", solutionSchema);
