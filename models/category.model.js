const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		slug: {
			type: String,
			required: true,
			unique: true,
		},
		questionId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Question",
			},
		],
	},
	{
		timestamps: true,
	}
);


module.exports = mongoose.model("Category", categorySchema);
