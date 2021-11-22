const Solution = require("../models/solution.model");
const Comment = require("../models/comment.model")
const User = require("../models/user.model");
const { promisify } = require("util");
require("@tensorflow/tfjs");
const toxicity = require("@tensorflow-models/toxicity");
const { sendMail } = require('./nodemailer');

const threshold = 0.8;

const getMaliciousPredictions = (predictions, onSuccess, onError) => {
      for (let prediction of predictions) {
            console.log(prediction.label + "     " + prediction.results[0].match)
            if (prediction.results[0].match === true) {
                  onError({
                        msg: `Your comment could not be posted as it consisted of content falling in ${prediction.label} category.`,
                  });
                  return;
            }
      }
      onSuccess({ msg: `Comment added... !` });
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

exports.addComment = async (req, res) => {
      try {
            console.log("Hi");
            await toxicity.load(threshold).then((model) => {
                  const sentences = [req.body.description];

                  model.classify(sentences).then((predictions) => {
                        const maliciousPredictions = promisify(getMaliciousPredictions);
                        maliciousPredictions(predictions)
                              .then(async (result) => {
                                    const { description, solutionId } = req.body;
                                    const authorID = req.user._id;

                                    const comment = new Comment({
                                          description,
                                          solutionId,
                                          authorID,
                                    });

                                    const _comment = await comment.save();

                                    await Solution.findByIdAndUpdate(
                                          solutionId,
                                          {
                                                $push: {
                                                      commentsId: _comment._id,
                                                },
                                          }
                                    );



                                    await User.findByIdAndUpdate(
                                          authorID,
                                          {
                                                $push: {
                                                      commentId: _comment._id,
                                                },
                                          }
                                    );

                                    // sendMail(req.body.question.authorID.email, `<p>A solution to your question <a href="http://localhost:8080/${question.slug}">${question.title}</a> has been posted</p>`);
                                    // ('email sent');
                                    return res.status(200).json({
                                          message: result.msg,
                                          comment: _comment
                                    });
                              })
                              .catch((err) => {
                                    console.log(err);
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
