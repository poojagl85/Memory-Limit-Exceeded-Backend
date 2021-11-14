require('@tensorflow/tfjs');
const toxicity = require('@tensorflow-models/toxicity');

const threshold = 0.9;


exports.verifyContent = async (req, res, next) => {

    await toxicity.load(threshold).then(model => {
        const sentences = [req.body.description];
      
        model.classify(sentences).then(predictions => {
          
           for(let prediction of predictions) {
              console.log(prediction.label + " " + prediction.results[0].match);
              if(prediction.results[0].match === true){
                  return res.status(403).json({
                      message : `Your solution/question could not be posted as it consisted of content falling in ${prediction.label} category.`
                  })
              };
          }
          
        });
      });

      next();
    
}

