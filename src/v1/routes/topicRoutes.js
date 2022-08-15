const express = require("express");
const topicController = require("../../controllers/topicController");

const router = express.Router();

router
    .post("/", topicController.createNewTopic);

module.exports =  router;