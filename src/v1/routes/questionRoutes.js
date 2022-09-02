const express = require("express");
const questionController = require("../../controllers/questionController");

const router = express.Router();

router
    .get("/", questionController.getAllQuestions)
    .post("/", questionController.createNewQuestion)
    .patch("/:questionId", questionController.updateOneQuestion)
    .delete("/:questionId", questionController.deleteOneQuestion)
    .get("/:questionId/answers", questionController.getQuestionAnswers)
    .post("/:questionId/answers",questionController.addNewAnswer)
    .patch("/:questionId/answers/:answerId", questionController.updateOneAnswer)
    .delete("/:questionId/answers/:answerId", questionController.deleteOneAnswer);

module.exports =  router;