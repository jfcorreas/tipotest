const { v4: uuid } = require('uuid');
const Topic = require("../database/Topic");

const getAllTopics = () => {
    try {
        const allTopics = Topic.getAllTopics();
        return allTopics;
    } catch (error) {
        throw error;
    }
};

const getTopicTests = (topicId) => {
    try {
        const topicTests = Topic.getTopicTests(topicId);
        return topicTests;
    } catch (error) {
        throw error;
    }
};

const getExistingTopics = (topicIds) => {
    try {
        const existingTopics = Topic.getExistingTopics(topicIds);
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
        const createdTopic = Topic.createNewTopic(topicToInsert);
        return createdTopic;
    } catch (error) {
        throw error;
    }
};

const updateOneTopic = (topicId, changes) => {
    try {
        const updatedTopic = Topic.updateOneTopic(topicId, changes);
        return updatedTopic;
    } catch (error) {
        throw error;
    }
};

const deleteOneTopic = (topicId) => {
    try {
        Topic.deleteOneTopic(topicId);
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