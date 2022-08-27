const { v4: uuid } = require('uuid');
const Test = require("../database/Test");
const topicService = require("./topicServices");
const convocationService = require("./convocationServices");
const questionService = require("./questionServices");

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

const createNewTest = (newTest, topicList, numQuestions) => {
    const testToInsert = {
        ...newTest,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }

    try {
        let convocation = false;
        if ( convocationService.convocationExists(testToInsert.convocationId)) {
            convocation = convocationService.getConvocationById(testToInsert.convocationId);
        }
        if (!convocation && !topicList) {
            throw {
                status: 400,
                message: `No topics available for the Test`,
            };
        }

        let topicsForTest = [];
        if (topicList.length > 0) {
            topicsForTest = topicService.getExistingTopics(topicList);
        }
        if (convocation && convocation.topicList && convocation.topicList.length > 0) {
            topicsForTest = topicsForTest.filter( (topicId) => convocation.topicList.includes(topicId));
        }
        
        topicsForTest.forEach(element => {
            testToInsert.questionList = testToInsert.questionList.concat(
                questionService.getQuestionsForTest(element, numQuestions, testToInsert.numChoices)
            );
        }); 
        
        const newTopicsForTest = topicsForTest.map( topicId => {
            return { topicId, testId: testToInsert.id };
        });

        const createdTest = Test.createNewTest(testToInsert, newTopicsForTest);
        return createdTest;
    } catch (error) {
        throw error;
    }
};

const completeOneTest = (testId, testResponses ) => {
    try {
        const completedTest = Test.completeOneTest(testId, testResponses);
        return completedTest;
    } catch (error) {
        throw error;
    }
};


const deleteOneTest = (testId) => {
    try {
        Test.deleteOneTest(testId);
    } catch (error) {
        throw error;
    }
}

module.exports = {
    getAllTests,
    getTestTopics,
    createNewTest,
    completeOneTest,
    deleteOneTest
};