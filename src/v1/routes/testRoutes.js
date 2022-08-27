const express = require("express");
const testController = require("../../controllers/testController");

const router = express.Router();

router
    .get("/", testController.getAllTests)
    .get("/:testId/topics", testController.getTestTopics)
    .post("/", testController.createNewTest)
    .patch("/:testId", testController.completeOneTest)
    .delete("/:testId", testController.deleteOneTest);

module.exports =  router;