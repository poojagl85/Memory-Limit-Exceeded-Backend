const express = require("express");
const { addSolution } = require("../controllers/solution.controller");
const router = express.Router();
const { requireSignin } = require("../middlewares/index");

router.post("/solution/add", requireSignin, postQuestion);

module.exports = router;
