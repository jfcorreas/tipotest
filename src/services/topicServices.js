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

module.exports = {
    getAllTopics,
    createNewTopic,
};