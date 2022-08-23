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

const updateOneConvocation = (convocationId, changes) => {
    try {
        const updatedConvocation = Convocation.updateOneConvocation(convocationId, changes);
        return updatedConvocation;
    } catch (error) {
        throw error;
    }
};

/*const deleteOneTopic = (convocationId) => {
    try {
        Convocation.deleteOneTopic(convocationId);
    } catch (error) {
        throw error;
    }
} */

module.exports = {
    getAllConvocations,
    createNewConvocation,
    updateOneConvocation,
    /*deleteOneTopic */
};