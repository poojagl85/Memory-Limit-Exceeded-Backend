const Solution = require("../models/solution.model");
const Question = require("../models/questions.model");
const User = require("../models/user.model");
const { promisify } = require("util");
require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");

const threshold = 0.9;

const getMaliciousPredictions = (predictions) => {
  try {
    for (let prediction of predictions) {
      console.log(prediction.label + " " + prediction.results[0].match);
      if (prediction.results[0].match === true) {
        throw new Error(
          `Your solution/question could not be posted as it consisted of content falling in ${prediction.label} category.`
        );
      }
    }
	return {message: "Success"};
  } catch (error) {
	  throw new Error(error.message);
  }

 
};


exports.addSolution = async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.user._id);

    await toxicity.load(threshold).then((model) => {
      const sentences = [req.body.description];

      model.classify(sentences).then((predictions) => {
        // getMaliciousPredictions(predictions , (err, result) => {
        // 	if(err){
        // 		console.log(err);
        // 	}else{
        // 		console.lod(result);
        // 	}
        // })

        const promise = promisify(getMaliciousPredictions);
        promise(predictions)
          .then((result) => {
			console.log(result);
            console.log("In then block");
            return res.status(200).json({
              message: `Solution added... !`,
            });
          })
          .catch((err) => {
            console.log("In catch block");
            return res.status(403).json({
              message: err.message,
            });
          });
      });
    });

    // const { description, questionId } = req.body;
    // const authorID = req.user._id;

    // const solution = new Solution({
    // 	description,
    // 	questionId,
    // 	authorID,
    // });

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
