const express = require("express");
const convocationController = require("../../controllers/convocationController");

const router = express.Router();

router
    .get("/", convocationController.getAllConvocations)
    .post("/", convocationController.createNewConvocation)
    .patch("/:convocationId", convocationController.updateOneConvocation)
    .delete("/:convocationId", convocationController.deleteOneConvocation);

module.exports =  router;