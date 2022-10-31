const Question = require('../database/Question')

const getAllQuestions = async (filterParams, sortResults) => {
  const filteredQuestions = await Question.getAllQuestions(filterParams, sortResults)
  return filteredQuestions
}

const getQuestionById = async (questionId) => {
  const question = await Question.getQuestionById(questionId)
  return question
}

const createNewQuestion = async (newQuestion) => {
  const createdQuestion = await Question.createNewQuestion(newQuestion)
  return createdQuestion
}

const updateOneQuestion = async (questionId, changes) => {
  const updatedQuestion = await Question.updateOneQuestion(questionId, changes)
  return updatedQuestion
}

const deleteOneQuestion = async (questionId) => {
  await Question.deleteOneQuestion(questionId)
}

const getQuestionAnswers = async (questionId, numAnswers, apiCall = true) => {
  const allAnswers = await Question.getAllQuestionAnswers(questionId)

  if (!numAnswers || numAnswers < 2) {
    return allAnswers
  }

  const { trueAnswers, falseAnswers } =
            allAnswers.reduce((r, answer) => {
              r[answer.isCorrect ? 'trueAnswers' : 'falseAnswers'].push(answer)
              return r
            }, { trueAnswers: [], falseAnswers: [] })

  if (!trueAnswers) {
    if (apiCall) {
      const dbError = new Error(`Question with id: '${questionId}' doesn't have any valid answer`)
      throw Object.assign(dbError, { status: 400 })
    }
    return false
  }

  if (falseAnswers.length < (numAnswers - 1)) {
    if (apiCall) {
      const dbError = new Error(`Question with id: '${questionId}' doesn't have enough false answers`)
      throw Object.assign(dbError, { status: 400 })
    }
    return false
  }

  const answers = new Array(trueAnswers[[trueAnswers.length * Math.random() | 0]])

  let falseAnswersLeft = numAnswers - 1
  while (falseAnswersLeft-- && falseAnswers.length > 0) {
    answers.push(falseAnswers.splice([[falseAnswers.length * Math.random() | 0]], 1).pop())
  }

  const suffleIndex = answers.length * Math.random() | 0
  if (suffleIndex > 0) {
    const tempElem = answers[suffleIndex]
    answers[suffleIndex] = answers[0]
    answers[0] = tempElem
  }

  return answers
}

const addNewAnswer = async (questionId, newAnswer) => {
  const createdAnswer = await Question.addNewAnswer(questionId, newAnswer)
  return createdAnswer
}

const updateOneAnswer = async (questionId, answerId, changes) => {
  const updatedAnswer = await Question.updateOneAnswer(questionId, answerId, changes)
  return updatedAnswer
}

const deleteOneAnswer = async (questionId, answerId) => {
  const questionAfterDelete = await Question.deleteOneAnswer(questionId, answerId)
  return questionAfterDelete
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  createNewQuestion,
  updateOneQuestion,
  deleteOneQuestion,
  getQuestionAnswers,
  addNewAnswer,
  updateOneAnswer,
  deleteOneAnswer
}
