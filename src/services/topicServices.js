const { v4: uuid } = require('uuid');
const Topic = require("../database/Topic");

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
    createNewTopic,
};