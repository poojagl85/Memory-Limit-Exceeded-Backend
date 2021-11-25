const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// routes
const categoryRoutes = require("./routes/category.route");
const userRoutes = require("./routes/user.route");
const questionRoutes = require("./routes/questions.route");
const fakeRoutes = require("./routes/faker.route");
const solutionRoutes = require("./routes/solution.route");
const commentRoutes = require("./routes/comment.route");

// enviroment variables, constants
require("dotenv").config();
const PORT = process.env.PORT;
const USER = process.env.MONGO_DB_USER;
const PASSWORD = process.env.MONGO_DB_PASSWORD;
const DATABASE = process.env.MONGO_DB_DATABASE;

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

var corsOptions = {
	origin: 'https://out-of-memory.vercel.app/',
	optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
	allowedHeaders: '*'
}
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api", questionRoutes);
app.use("/api", categoryRoutes);
app.use("/api", userRoutes);
app.use("/api", solutionRoutes);
app.use("/api", commentRoutes);
app.use("/api", fakeRoutes);

app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
