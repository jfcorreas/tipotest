const { Test } = require("./schemas/TestSchema");

const getAllTests = async () => {
    try {
        const allTests = await Test.find({});
        return allTests;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const getOneTest = async (testId, projection = null) => {
    try {
        const test = await Test.findById(testId, projection).exec();
        return test;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewTest = async (newTest) => {
    try {
        const createdTest = new Test(newTest);
        createdTest.createdAt = new Date();
        createdTest.updatedAt = new Date();
        await Test.create(createdTest);
        return createdTest;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const completeOneTest = async (testId, testResponses, newScore) => {
    try {
        const completedTest = await Test.findById(testId).exec();
        if (!completedTest) {
            throw {
                status: 400,
                message: `Can't find Test with the id '${testId}`
            };            
        }    

        if (testResponses) completedTest.responses = testResponses;
        if (newScore) completedTest.score = newScore;
        completedTest.submitted = true;
        completedTest.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});

        const updatedTest = await completedTest.save();
        return updatedTest;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

const deleteOneTest = async (testId) => {
    try {
        await Test.findByIdAndDelete(testId);
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

module.exports = {
    getAllTests,
    getOneTest,
    createNewTest,
    completeOneTest,
    deleteOneTest
}