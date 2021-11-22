const express = require("express");
const { addComment } = require("../controllers/comment.controller");
const router = express.Router();
const { requireSignin } = require("../middlewares/index");

router.post("/:id/addComment", requireSignin, addComment);


module.exports = router;
