const express = require("express");
const { addSolution, getSolutionDetail } = require("../controllers/solution.controller");
const router = express.Router();
const { requireSignin } = require("../middlewares/index");

router.post("/:id/addSolution", requireSignin, addSolution);
router.get("/solution", getSolutionDetail);


module.exports = router;
