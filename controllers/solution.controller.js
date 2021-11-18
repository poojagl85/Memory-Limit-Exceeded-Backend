const Solution = require("../models/solution.model");
const Question = require("../models/questions.model");
const User = require("../models/user.model");
const { promisify } = require("util");
require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");
const { sendMail } = require('./nodemailer');

const threshold = 0.9;

const getMaliciousPredictions = (predictions, onSuccess, onError) => {
  for (let prediction of predictions) {
    if (prediction.results[0].match === true) {
      onError({
        msg: `Your solution/question could not be posted as it consisted of content falling in ${prediction.label} category.`,
      });
      return;
    }
  }
  onSuccess({ msg: `Solution added... !` });
};

getMaliciousPredictions[promisify.custom] = (predictions) => {
  return new Promise((resolve, reject) => {
    getMaliciousPredictions(
      predictions,
      (onSuccess) => resolve(onSuccess),
      (onError) => reject(onError)
    );
  });
};

exports.addSolution = async (req, res) => {
  try {
    await toxicity.load(threshold).then((model) => {
      const sentences = [req.body.description];

      model.classify(sentences).then((predictions) => {
        const maliciousPredictions = promisify(getMaliciousPredictions);
        maliciousPredictions(predictions)
          .then(async (result) => {
            const { description, questionId } = req.body;
            const { question } = req.body;
            const authorID = req.user._id;

            const solution = new Solution({
              description,
              questionId,
              authorID,
            });

            const _solution = await solution.save();

            await Question.updateOne(
              { _id: questionId },
              {
                $push: {
                  solutionId: _solution._id,
                },
              }
            );



            await User.updateOne(
              { _id: authorID },
              {
                $push: {
                  activityId: _solution._id,
                },
              }
            );

            sendMail(req.body.question.authorID.email, `<p>A solution to your question <a href="http://localhost:8080/${question.slug}">${question.title} has been posted</a></p>`);
            ('email sent');
            return res.status(200).json({
              message: result.msg,
              solution: _solution
            });
          })
          .catch((err) => {
            return res.status(403).json({
              message: err.msg,
            });
          });
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
};
