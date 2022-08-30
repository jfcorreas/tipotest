const { v4: uuid } = require('uuid');
const TopicFile = require("../database/TopicFile");
const Topic = require("../database/Topic");

const getAllTopics = async () => {
    try {
        const allTopics = await Topic.getAllTopics();
        return allTopics;
    } catch (error) {
        throw error;
    }
};

const getTopicTests = (topicId) => {
    try {
        const topicTests = TopicFile.getTopicTests(topicId);
        return topicTests;
    } catch (error) {
        throw error;
    }
};

const getExistingTopics = (topicIds) => {
    try {
        const existingTopics = TopicFile.getExistingTopics(topicIds);
        return existingTopics;
    } catch (error) {
        throw error;
    }
};

const createNewTopic = async (newTopic) => {
    try {
        const createdTopic = await Topic.createNewTopic(newTopic);
        return createdTopic;
    } catch (error) {
        throw error;
    }
};

const updateOneTopic = async (topicId, changes) => {
    try {
        const updatedTopic = await Topic.updateOneTopic(topicId, changes);
        return updatedTopic;
    } catch (error) {
        throw error;
    }
};

const deleteOneTopic = async (topicId) => {
    try {
        await Topic.deleteOneTopic(topicId);
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllTopics,
    getTopicTests,
    getExistingTopics,
    createNewTopic,
    updateOneTopic,
    deleteOneTopic
};