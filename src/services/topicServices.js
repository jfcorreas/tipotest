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

const createNewTopic = (newTopic) => {
    const topicToInsert = {
        ...newTopic,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }
    try {
        const createdTopic = TopicFile.createNewTopic(topicToInsert);
        return createdTopic;
    } catch (error) {
        throw error;
    }
};

const updateOneTopic = (topicId, changes) => {
    try {
        const updatedTopic = TopicFile.updateOneTopic(topicId, changes);
        return updatedTopic;
    } catch (error) {
        throw error;
    }
};

const deleteOneTopic = (topicId) => {
    try {
        TopicFile.deleteOneTopic(topicId);
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