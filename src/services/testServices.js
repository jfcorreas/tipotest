const Test = require("../database/Test");
const Convocation = require("../database/Convocation");
const Topic = require("../database/Topic");
const TopicTest = require("../database/TopicTest");
const Question = require("../database/Question");
const questionService = require("./questionServices");

const getAllTests = async () => {
    try {
        const allTests = await Test.getAllTests();
        return allTests;
    } catch (error) {
        throw error;
    }
};

const getTestTopics = async (testId) => {
    try {
        const testTopics = await TopicTest.getTestTopics(testId);
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

        let validTopics = [];

        if (topicList){
           validTopics = await Topic.getExistingTopics(topicList);
           validTopics = validTopics.map( (topic) => {
               return topic._id;
           });
        }

        if (!convocation && validTopics.length < 1) {
            throw {
                status: 400,
                message: `No topics available for the Test`,
            };
        }
        
        let topicsForTest = [];
        if (convocation) {
            topicsForTest = topicsForTest.concat(convocation.topicList);
            topicsForTest = topicsForTest.map( (topic) => {
                return topic._id;
            });
        }
        if (convocation && validTopics.length > 0){
            topicsForTest = topicsForTest.filter( topic => validTopics.includes(topic));
        } 

        if (topicsForTest.length === 0) {
            throw {
                status: 400,
                message: `No topics available for the Test`,
            };
        }
        console.log(topicsForTest)
        let questionsForTest = [];
        for (const topic of topicsForTest) {
            const selectedQuestions = await getQuestionsForTest(topic, numQuestions / topicsForTest.length, newTest.numChoices);
            questionsForTest = questionsForTest.concat(selectedQuestions);
        }

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

const completeOneTest = async (testId, testResponses ) => {
    try {
        const undoneTest = await Test.getOneTest(testId, 'questionList numChoices scoringGormula');
        if (!undoneTest) {
            throw {
                status: 400,
                message: `Can't find Test with the id '${testId}`
            };            
        } 

        if ( !testResponses || 
            testResponses.constructor.name != "Array" ||
            testResponses.length != undoneTest.questionList.length ||
            !testResponses.every( (choice) => choice < undoneTest.numChoices) ) {
            throw {
                status: 400,
                message: `Not valid or incomplete responses submitted`
            };
        }
        
        let hits = 0, faults = 0;
        testResponses.forEach( (choice, index) => {
            if ( undoneTest.questionList[index].answers[choice].isCorrect ) {
                hits++;
            } else {
                faults++;
            }
        });
        
        let newScore = 0;
        switch (undoneTest.scoringFormula) {
            case "H-(F/4)":
            default:    newScore = hits - (faults / 4);  
        }

        const completedTest = await Test.completeOneTest(testId, testResponses, newScore);
        return completedTest;
    } catch (error) {
        throw error;
    }
};


const deleteOneTest = async (testId) => {
    try {
        await Test.deleteOneTest(testId);
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