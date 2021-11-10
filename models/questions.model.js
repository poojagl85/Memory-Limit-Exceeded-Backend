const mongoose = require("mongoose");

const questionSchema = mongoose.Schema(
	{
		title: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
		},
		description: {
			type: String,
			required: true,
		},
		authorID: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		categoryId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		solutionId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Solution",
			},
		],
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Question", questionSchema);
