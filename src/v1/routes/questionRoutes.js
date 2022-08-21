const express = require("express");
const questionController = require("../../controllers/questionController");

const router = express.Router();

router
    .get("/", questionController.getAllQuestions)
    .post("/", questionController.createNewQuestion)
    .patch("/:questionId", questionController.updateOneQuestion)
    .get("/:questionId/answers", questionController.getQuestionAnswers)
    .post("/:questionId/answers",questionController.addNewAnswer);

module.exports =  router;