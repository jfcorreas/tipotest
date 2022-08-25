const { v4: uuid } = require('uuid');
const Test = require("../database/Test");

const getAllTests = () => {
    try {
        const allTests = Test.getAllTests();
        return allTests;
    } catch (error) {
        throw error;
    }
};

const getTestTopics = (testId) => {
    try {
        const testTopics = Test.getTestTopics(testId);
        return testTopics;
    } catch (error) {
        throw error;
    }
};
/*
 const createNewTest = (newTest) => {
    const testToInsert = {
        ...newTest,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }
    try {
        const createdConvocation = Test.createNewConvocation(convocationToInsert);
        return createdConvocation;
    } catch (error) {
        throw error;
    }
};

const updateOneConvocation = (convocationId, changes) => {
    try {
        const updatedConvocation = Test.updateOneConvocation(convocationId, changes);
        return updatedConvocation;
    } catch (error) {
        throw error;
    }
};

const updateConvocationTopics = (convocationId, topics) => {
    try {
        const updatedConvocation = Test.updateConvocationTopics(convocationId, topics);
        return updatedConvocation;
    } catch (error) {
        throw error;
    }
};

const deleteOneConvocation = (convocationId) => {
    try {
        Test.deleteOneConvocation(convocationId);
    } catch (error) {
        throw error;
    }
} */

module.exports = {
    getAllTests,
    getTestTopics
/*    createNewTest
     updateOneConvocation,
    updateConvocationTopics,
    deleteOneConvocation */
};