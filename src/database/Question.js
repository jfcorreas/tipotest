const DB = require("./tipotestdb.json");
const { saveToDatabase } = require("./utils");

const getAllQuestions = (filterParams) => {
    try {
        let questions = DB.questions;
        if (filterParams.topic) {
            questions = questions.filter((question) => question.topic === filterParams.topic);
        }
        return questions;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
}

const createNewQuestion = (newQuestion) => {
    try {
        const topicExists = DB.topics.findIndex((topic) => topic.id === newQuestion.topic) > -1;

        if (!topicExists) {
            throw {
                status: 400,
                message: `Does not exists any topic with id: ${newQuestion.topic}`
            };
        }

        const isAlreadyAdded = 
            DB.questions.findIndex((question) => 
                (question.text === newQuestion.text) && (question.topic === newQuestion.topic)) > -1;

        if (isAlreadyAdded) {
            throw {
                status: 400,
                message: `Question with text: '${newQuestion.text}' already exists for topic: '${newQuestion.topic}'`,
            };
        }

        DB.questions.push(newQuestion);
        saveToDatabase(DB);
        return newQuestion;
    } catch (error) {
        throw {
            status: error?.status || 500,
            message: error?.message || error,
        }
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion
};