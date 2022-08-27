const express = require("express");
const testController = require("../../controllers/testController");

const router = express.Router();

router
    .get("/", testController.getAllTests)
    .get("/:testId/topics", testController.getTestTopics)
    .post("/", testController.createNewTest)
    .post("/:testId", testController.completeOneTest);
/*    .patch("/:convocationId", testController.updateOneConvocation)
    .patch("/:convocationId/topics", testController.updateConvocationTopics)
    .delete("/:convocationId", testController.deleteOneConvocation); */

module.exports =  router;