const { v4: uuid } = require('uuid');
const Convocation = require("../database/Convocation");

const getAllConvocations = () => {
    try {
        const allConvocations = Convocation.getAllConvocations();
        return allConvocations;
    } catch (error) {
        throw error;
    }
};

/* const createNewTopic = (newTopic) => {
    const topicToInsert = {
        ...newTopic,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }
    try {
        const createdTopic = Convocation.createNewTopic(topicToInsert);
        return createdTopic;
    } catch (error) {
        throw error;
    }
};

const updateOneTopic = (topicId, changes) => {
    try {
        const updatedTopic = Convocation.updateOneTopic(topicId, changes);
        return updatedTopic;
    } catch (error) {
        throw error;
    }
};

const deleteOneTopic = (topicId) => {
    try {
        Convocation.deleteOneTopic(topicId);
    } catch (error) {
        throw error;
    }
} */

module.exports = {
    getAllConvocations,
/*     createNewTopic,
    updateOneTopic,
    deleteOneTopic */
};