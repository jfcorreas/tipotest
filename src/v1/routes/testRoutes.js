const express = require("express");
const testController = require("../../controllers/testController");

const router = express.Router();

router
    .get("/", testController.getAllTests);
/*     .post("/", testController.createNewConvocation)
    .patch("/:convocationId", testController.updateOneConvocation)
    .patch("/:convocationId/topics", testController.updateConvocationTopics)
    .delete("/:convocationId", testController.deleteOneConvocation); */

module.exports =  router;