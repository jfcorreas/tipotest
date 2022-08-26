const express = require("express");
const convocationController = require("../../controllers/convocationController");

const router = express.Router();

router
    .get("/", convocationController.getAllConvocations)
    .get("/:convocationId", convocationController.getConvocationById)
    .post("/", convocationController.createNewConvocation)
    .patch("/:convocationId", convocationController.updateOneConvocation)
    .patch("/:convocationId/topics", convocationController.updateConvocationTopics)
    .delete("/:convocationId", convocationController.deleteOneConvocation);

module.exports =  router;