const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		email: {
			type: String,
			required: true,
			unique: true,
			lowercase: true,
		},
		hash_password: {
			type: String,
			required: true,
		},
		categoryId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Category",
			},
		],
		questionId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Question'
			},
		],
		solutionId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Solution'
			},
		],
		commentId: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Comment'
			}
		]
	},
	{
		timestamps: true,
	}
);

userSchema.virtual("password").set(function (password) {
	this.hash_password = bcrypt.hashSync(password, 10);
});
userSchema.methods = {
	authenticate: function (password) {
		return bcrypt.compareSync(password, this.hash_password);
	},
};

module.exports = mongoose.model("User", userSchema);
