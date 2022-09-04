const { v4: uuid } = require('uuid');
const ConvocationFile = require("../database/ConvocationFile");
const Convocation = require("../database/Convocation");

const convocationExists = (convocationId) => {
    try {
        return ConvocationFile.convocationExists(convocationId);
    } catch (error) {
        throw error;
    }
};

const getAllConvocations = async (filterParams) => {
    try {
        const allConvocations = await Convocation.getAllConvocations(filterParams);
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

const updateConvocationTopics = (convocationId, topics) => {
    try {
        const updatedConvocation = ConvocationFile.updateConvocationTopics(convocationId, topics);
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
    convocationExists,
    getAllConvocations,
    getConvocationById,
    createNewConvocation,
    updateOneConvocation,
    updateConvocationTopics,
    deleteOneConvocation
};