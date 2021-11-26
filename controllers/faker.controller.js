var faker = require("faker");
const User = require("../models/user.model");
const Category = require("../models/category.model");
const Question = require("../models/questions.model");
const { default: slugify } = require("slugify");
const Solution = require("../models/solution.model");

exports.createFakeUser = async (req, res) => {
	try {
		const categories = await Category.find({});

		for (let i = 0; i <= 100; i++) {
			const fullName = faker.name.findName();
			const email = faker.internet.email();

			const password = faker.internet.password();

			const idx = parseInt(Math.random() * categories.length);
			const categoryId = [];
			const catId = categories[idx]._id;
			const catId2 =
				idx + 1 < categories.length
					? categories[idx + 1]._id
					: categories[idx - 1]._id;
			categoryId.push(catId);
			categoryId.push(catId2);

			const _user = new User({
				fullName,
				email,
				password,
				categoryId,
			});

			_user.save();
		}

		return res.status(200).json({
			message: "Data created...!",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

exports.createQuestion = async (req, res) => {
	try {
		const categories = await Category.find({});
		const users = await User.find({});

		for (let i = 0; i <= 95; i++) {
			let title = faker.name.title();
			let description = faker.lorem.paragraphs();
			const idx = parseInt(Math.random() * categories.length);
			const categoryId = categories[idx]._id;
			const authorID = users[parseInt(Math.random() * users.length)]._id;
			const slug = slugify(title);

			const _question = new Question({
				title,
				description,
				categoryId,
				authorID,
				slug,
			});
			_question.save();

			const _cat = await Category.updateOne(
				{ _id: categoryId },
				{
					$push: {
						questionId: _question._id,
					},
				}
			);

			const _user = await User.updateOne(
				{ _id: authorID },
				{
					$push: {
						questionId: _question._id,
					},
				}
			);
		}

		return res.status(200).json({
			message: "Data created",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};

exports.addSolution = async (req, res) => {
	try {
		const questions = await Question.find({});
		const users = await User.find({});

		for (let i = 0; i <= 200; i++) {
			let description = faker.lorem.paragraphs();
			const authorID = users[parseInt(Math.random() * users.length)]._id;
			const questionId =
				questions[parseInt(Math.random() * questions.length)]._id;

			const _sol = new Solution({
				authorID,
				description,
				questionId,
			});

			_sol.save();

			const _user = await User.updateOne(
				{ _id: authorID },
				{
					$push: {
						solutionId: _sol._id,
					},
				}
			);

			const q = await Question.updateOne(
				{ _id: questionId },
				{
					$push: {
						solutionId: _sol._id,
					},
				}
			);
		}

		return res.status(200).json({
			message: "Solutions created",
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			message: "Internal Server Error",
		});
	}
};
