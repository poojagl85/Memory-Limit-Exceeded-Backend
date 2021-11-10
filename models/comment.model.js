const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
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
		solutionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Solution",
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Comment", commentSchema);
