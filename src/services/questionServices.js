const { v4: uuid } = require('uuid');
const Question = require("../database/Question");

const getAllQuestions = (filterParams) => {
    try {
        const filteredQuestions = Question.getAllQuestions(filterParams);
        return filteredQuestions;
    } catch (error) {
        throw error;
    }
};

const createNewQuestion = (newQuestion) => {
    const questionToInsert = {
        ...newQuestion,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }
    try {
        const createdQuestion = Question.createNewQuestion(questionToInsert);
        return createdQuestion;
    } catch (error) {
        throw error;
    }
};

const addNewAnswer = (questionId, newAnswer) => {
    const answerToInsert = {
        ...newAnswer,
        id: uuid(),
        createdAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
        updatedAt: new Date().toLocaleString("en-US", { timeZone: "UTC"}),
    }
    try {
        const createdAnswer = Question.addNewAnswer(questionId, answerToInsert);
        return createdAnswer;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllQuestions,
    createNewQuestion,
    addNewAnswer
};