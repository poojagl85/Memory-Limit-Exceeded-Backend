const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

// routes
const categoryRoutes = require("./routes/category.route");
const userRoutes = require("./routes/user.route");
const questionRoutes = require("./routes/questions.route");
const fakeRoutes = require("./routes/faker.route");
const solutionRoutes = require("./routes/solution.route");
const commentRoutes = require("./routes/comment.route");
const { PORT, MONGO_DB_USER, MONGO_DB_PASSWORD, MONGO_DB_DATABASE } = require("./config");

// enviroment variables, constants
const USER = MONGO_DB_USER;
const PASSWORD = MONGO_DB_PASSWORD;
const DATABASE = MONGO_DB_DATABASE;

// mongodb connection
mongoose
	.connect(
		`mongodb+srv://${USER}:${PASSWORD}@cluster0.ftfmt.mongodb.net/${DATABASE}?retryWrites=true&w=majority`,
		{
			useNewUrlParser: true,
			useUnifiedTopology: true,
		}
	)
	.then(() => {
		console.log("Database connected");
	});

app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", questionRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", solutionRoutes);
app.use("/api", commentRoutes);
app.use("/api", fakeRoutes);

// app.use(express.static("build"));
// app.get("*", (req, res) => {
// 	res.sendFile(path.resolve(__dirname, "build", "index.html"))
// })

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
