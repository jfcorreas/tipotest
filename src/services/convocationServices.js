const Convocation = require("../database/Convocation");

const getAllConvocations = async (filterParams, sortResults) => {
    try {
        const allConvocations = await Convocation.getAllConvocations(filterParams, sortResults);
        return allConvocations;
    } catch (error) {
        throw error;
    }
};

const getConvocationById = async (convocationId) => {
    try {
        const convocationReq = await Convocation.getConvocationById(convocationId);
        return convocationReq;
    } catch (error) {
        throw error;
    }
};

const createNewConvocation = async (newConvocation) => {
    try {
        const createdConvocation = await Convocation.createNewConvocation(newConvocation);
        return createdConvocation;
    } catch (error) {
        throw error;
    }
};

const updateOneConvocation = async (convocationId, changes) => {
    try {
        const updatedConvocation = await Convocation.updateOneConvocation(convocationId, changes);
        return updatedConvocation;
    } catch (error) {
        throw error;
    }
};

const updateOneConvocationTopics = async (convocationId, topics) => {
    try {
        const updatedConvocation = await Convocation.updateOneConvocationTopics(convocationId, topics);
        return updatedConvocation;
    } catch (error) {
        throw error;
    }
};

const deleteOneConvocation = async (convocationId) => {
    try {
        await Convocation.deleteOneConvocation(convocationId);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllConvocations,
    getConvocationById,
    createNewConvocation,
    updateOneConvocation,
    updateOneConvocationTopics,
    deleteOneConvocation
};