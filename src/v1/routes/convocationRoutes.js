const express = require("express");
const convocationController = require("../../controllers/convocationController");

const router = express.Router();

router
    .get("/", convocationController.getAllConvocations)
/*     .post("/", convocationController.createNewTopic)
    .patch("/:topicId", convocationController.updateOneTopic)
    .delete("/:topicId", convocationController.deleteOneTopic); */

module.exports =  router;