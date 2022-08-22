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
}

module.exports = {
    getAllTopics,
    createNewTopic,
    updateOneTopic,
    deleteOneTopic
};