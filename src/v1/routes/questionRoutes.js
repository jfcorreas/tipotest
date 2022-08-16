const express = require("express");
const questionController = require("../../controllers/questionController");

const router = express.Router();

router
    .get("/", questionController.getAllQuestions)
    .post("/", questionController.createNewQuestion)
    .post("/:questionId",questionController.addNewAnswer);

module.exports =  router;