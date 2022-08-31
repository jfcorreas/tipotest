const Question = require("../database/schemas/QuestionSchema");
const Topic = require("../database/Topic");

const getAllQuestions = async (filterParams) => {
    try {
        const allQuestions = await Question.find();
        return allQuestions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const createNewQuestion = async (newQuestion) => {
    try {
        const createdQuestion = new Question(newQuestion);
        await Question.create(createdQuestion);
        return createdQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

const updateOneQuestion = async (questionId, changes) => {
    try {
        const questionChanges = await Question.findById(questionId).exec();
        if (!questionChanges) {
            throw {
                status: 400,
                message: `Can't find Question with the id '${questionId}`
            };            
        }

        const topic = await Topic.getOneTopic(changes.topic);

        questionChanges.text = changes.text? changes.text : questionChanges.text;
        questionChanges.topic = topic? topic._id : questionChanges.topic;
        questionChanges.updatedAt = new Date().toLocaleString("en-US", {timeZone: "UTC"});

        const updatedQuestion = await questionChanges.save();
        return updatedQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        };
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion,
    updateOneQuestion
};