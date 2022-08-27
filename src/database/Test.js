const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllTests = () => {
    try {
        const allTests = DB.tests;
        return allTests;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getTestTopics = (testId) => {
    try {
        const testTopics = DB.topicsTests.filter( (testTopic) => testTopic.testId === testId );
        const topicList = testTopics.map( ({topicId, testId} ) => topicId);
        return topicList;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const addTopicTestElements = (newElements) => {
    try {
        const newTopicsTests = DB.topicsTests.concat(newElements);
        DB.topicsTests = newTopicsTests;
        saveToDatabase(DB);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewTest = (newTest) => {
    try {
        DB.tests.push(newTest);
        saveToDatabase(DB);
        return newTest;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const completeOneTest = (testId, testResponses) => {
    try {
        const indexTestForUpdate = DB.tests.findIndex( (test) => test.id === testId );
        if (indexTestForUpdate === -1) {
            throw {
                status: 400,
                message: `Can't find Test with the id '${testId}'`,
            };        
        }   

        const originalTest = DB.tests[indexTestForUpdate];
        if ( !testResponses || 
            testResponses.constructor.name != "Array" ||
            testResponses.length < originalTest.questionList.length ||
            !testResponses.every( (choice) => choice < originalTest.numChoices) ) {
            throw {
                status: 400,
                message: `Not valid or incomplete responses submitted`
            };
        }
        
        let hits = 0, faults = 0;
        testResponses.forEach( (choice, index) => {
            if ( originalTest.questionList[index].answers[choice].isCorrect ) {
                hits++;
            } else {
                faults++;
            }
        });
        
        let newScore = 0;
        switch (originalTest.scoringFormula) {
            case "H-(F/4)":
            default:    newScore = hits - (faults / 4);  
        }

        const updatedTest = {
            ...originalTest,
            responses: testResponses,
            submitted: true,
            score: newScore,
            updatedAt: new Date().toLocaleString("en-US", {timeZone: "UTC"}),
        };
    
        DB.tests[indexTestForUpdate] = updatedTest;
        saveToDatabase(DB);
        return updatedTest;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};
/*
const deleteOneConvocation = (convocationId) => {
    try {
        const indexForDeletion = DB.convocations.findIndex(
            (convocation) => convocation.id === convocationId
        );
        if (indexForDeletion === -1) {
            throw {
                status: 400,
                message: `Can't find Convocation with the id '${convocationId}'`,
            }; 
        }
        DB.convocations.splice(indexForDeletion, 1);
        saveToDatabase(DB);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
}; */

module.exports = {
    getAllTests,
    getTestTopics,
    addTopicTestElements,
    createNewTest,
    completeOneTest
};