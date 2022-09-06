const Topic = require("../database/Topic");
const TopicTest = require("../database/TopicTest");

const getAllTopics = async (filterParams) => {
    try {
        const allTopics = await Topic.getAllTopics(filterParams);
        return allTopics;
    } catch (error) {
        throw error;
    }
};

const getTopicTests = async (topicId) => {
    try {
        const topicTests = await TopicTest.getTopicTests(topicId);
        return topicTests;
    } catch (error) {
        throw error;
    }
};

const getExistingTopics = async (topicIds) => {
    try {
        const existingTopics = await Topic.getExistingTopics(topicIds);
        return existingTopics;
    } catch (error) {
        throw error;
    }
};

const getOneTopic = async (topicId) => {
    try {
        const topic = Topic.getOneTopic(topicId);
        return topic;
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
    getOneTopic,
    createNewTopic,
    updateOneTopic,
    deleteOneTopic
};