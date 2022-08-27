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

const getQuestionsForTest = (topicId, numQuestions, numAnswers) => {
    try {
        const questionsForTest = Question.getQuestionsForTest(topicId, numQuestions, numAnswers);
        return questionsForTest;
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

const updateOneQuestion = (questionId, changes) => {
    try {
        const updatedQuestion = Question.updateOneQuestion(questionId, changes);
        return updatedQuestion;
    } catch (error) {
        throw error;
    }
};

const deleteOneQuestion = (questionId) => {
    try {
        Question.deleteOneQuestion(questionId);
    } catch (error) {
        throw error;
    }
};

const getQuestionAnswers = (questionId, numAnswers) => {
    try {
        const answers = Question.getQuestionAnswers(questionId, numAnswers);
        return answers;
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

const updateOneAnswer = (questionId, answerId, changes) => {
    try {
        const updatedAnswer = Question.updateOneAnswer(questionId, answerId, changes);
        return updatedAnswer;
    } catch (error) {
        throw error;
    }
};

module.exports = {
    getAllQuestions,
    getQuestionsForTest,
    createNewQuestion,
    updateOneQuestion,
    deleteOneQuestion,
    getQuestionAnswers,
    addNewAnswer,
    updateOneAnswer
};