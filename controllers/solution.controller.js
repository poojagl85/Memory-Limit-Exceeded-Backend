const Solution = require("../models/solution.model");
const Question = require("../models/questions.model");
const User = require("../models/user.model");
const { promisify } = require("util");
require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");

const threshold = 0.9;

const getMaliciousPredictions = (predictions, callback) => {
  console.log(predictions);
  for (let prediction of predictions) {
    console.log(prediction.label + " " + prediction.results[0].match);
    if (prediction.results[0].match === true) {
      return callback(
        new Error(
          `Your solution/question could not be posted as it consisted of content falling in ${prediction.label} category.`
        ),
        null
      );
    }
  }

  return callback(null, "Success");
};

// const getSumAsync = (num1, num2, callback) => {

// 	if (!num1 || !num2) {
// 	  return callback(new Error("Missing arguments"), null);
// 	}
// 	return callback(null, num1 + num2);
//   }
//   getSumAsync(1, 1, (err, result) => {
// 	if (err){
// 	  doSomethingWithError(err)
// 	}else {
// 	  console.log(result) // 2
// 	}
//   })

//   const getSumPromise = promisify(getSumAsync) // step 1
// getSumPromise(1, 1) // step 2
// .then(result => {
//   console.log(result)
// })
// .catch(err =>{
//   doSomethingWithError(err);
// })

exports.addSolution = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user._id);

    await toxicity.load(threshold).then((model) => {
      const sentences = [req.body.description];

      model.classify(sentences).then((predictions) => {
        const promise = promisify(getMaliciousPredictions);
        promise(predictions, (err, result) => {
          if (err) {
            console.log("In promise callback error block");
            return res.status(403).json({
              message: err.message,
            });
          } else {
            console.log("In promise callback result  block");
            return res.status(200).json({
              message: `Solution added... !`,
            });
          }

          // const { description, questionId } = req.body;
          // const authorID = req.user._id;

          // const solution = new Solution({
          // 	description,
          // 	questionId,
          // 	authorID,
        });
      });
    });

    // const _solution = await solution.save();

    // const _question = await Question.updateOne(
    // 	{ _id: questionId },
    // 	{
    // 		$push: {
    // 			solutionId: _solution._id,
    // 		},
    // 	}
    // );

    // const _user = await User.updateOne(
    // 	{ _id: authorID },
    // 	{
    // 		$push: {
    // 			activityId: _solution._id,
    // 		},
    // 	}
    // );

    // console.log(_solution);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
