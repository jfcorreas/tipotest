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

const createNewConvocation = (newConvocation) => {
    const convocationToInsert = {
        ...newConvocation,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }
    try {
        const createdConvocation = Convocation.createNewConvocation(convocationToInsert);
        return createdConvocation;
    } catch (error) {
        throw error;
    }
};

/*const updateOneTopic = (topicId, changes) => {
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
    createNewConvocation,
/*    updateOneTopic,
    deleteOneTopic */
};