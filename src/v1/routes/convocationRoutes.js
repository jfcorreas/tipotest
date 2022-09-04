const express = require("express");
const convocationController = require("../../controllers/convocationController");

const router = express.Router();

router
    .get("/", convocationController.getAllConvocations)
    .post("/", convocationController.createNewConvocation)
    .get("/:convocationId", convocationController.getConvocationById)
    .patch("/:convocationId", convocationController.updateOneConvocation)
    .delete("/:convocationId", convocationController.deleteOneConvocation)
    .patch("/:convocationId/topics", convocationController.updateConvocationTopics);

module.exports =  router;