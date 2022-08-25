const express = require("express");
const topicController = require("../../controllers/topicController");

const router = express.Router();

router
    .get("/", topicController.getAllTopics)
    .post("/", topicController.createNewTopic)
    .patch("/:topicId", topicController.updateOneTopic)
    .delete("/:topicId", topicController.deleteOneTopic)
    .get("/:topicId/tests", topicController.getTopicTests);

module.exports =  router;