const TestFile = require("../database/TestFile");
const Test = require("../database/Test");
const Convocation = require("../database/Convocation");
const Topic = require("../database/Topic");
const Question = require("../database/Question");
const TopicTest = require("../database/TopicTest");
const questionService = require("./questionServices");

const getAllTests = async () => {
    try {
        const allTests = await Test.getAllTests();
        return allTests;
    } catch (error) {
        throw error;
    }
};

const getTestTopics = (testId) => {
    try {
        const testTopics = TestFile.getTestTopics(testId);
        return testTopics;
    } catch (error) {
        throw error;
    }
};

const getQuestionsForTest = async (topicId, numQuestions, numAnswers) => {
    try {
        let questionsSample = await Question.getQuestionSample(topicId, numQuestions);
        
        for (const question of questionsSample) {
            question.answers = await questionService.getQuestionAnswers(question._id, numAnswers, false);
            
            if (!question.answers) {
                const badQuestionIndex = questionsSample.findIndex( (element) => element.id == question.id);
                questionsSample.splice(badQuestionIndex, 1);
            }
        }
        return questionsSample;

    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewTest = async (newTest, topicList, numQuestions) => {
    try {
        const convocation = await Convocation.getConvocationById(newTest.convocationId);

        let validTopics = await Topic.getExistingTopics(topicList);
        validTopics = validTopics.map( (topic) => {
            return topic._id;
        });

        if (!convocation && validTopics < 1) {
            throw {
                status: 400,
                message: `No topics available for the Test`,
            };
        }
        
        let topicsForTest = validTopics;
        if (convocation){
            topicsForTest = validTopics.filter( topic => convocation.topicList.includes(topic));
        } 

        if (topicsForTest < 1) {
            throw {
                status: 400,
                message: `No topics available for the Test`,
            };
        }
        let questionsForTest = [];
        for (const topic of topicsForTest) {
            const selectedQuestions = await getQuestionsForTest(topic, numQuestions / topicsForTest.length, newTest.numChoices);
            questionsForTest = questionsForTest.concat(selectedQuestions);
        }
        console.log(questionsForTest[0]);
        if ( questionsForTest.length < 1) {
            throw {
                status: 400,
                message: `No questions available with ${newTest.numChoices} answers for the Test`,
            };
        }        
        
        newTest.questionList = questionsForTest;
        const createdTest = await Test.createNewTest(newTest);

        const newTopicsForTest = topicsForTest.map( topicId => {
            return { topicId, testId: createdTest._id };
        });
        await TopicTest.createNewTopicsForTest( newTopicsForTest );
        
        return createdTest; 
    } catch (error) {
        throw error;
    }
};

const completeOneTest = (testId, testResponses ) => {
    try {
        const completedTest = TestFile.completeOneTest(testId, testResponses);
        return completedTest;
    } catch (error) {
        throw error;
    }
};


const deleteOneTest = (testId) => {
    try {
        TestFile.deleteOneTest(testId);
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