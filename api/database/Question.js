const { Question } = require('../database/schemas/QuestionSchema')
const Topic = require('../database/schemas/TopicSchema')

const getAllQuestions = async (filterParams, sortResults = { updatedAt: 1 }) => {
  try {
    const allQuestions = await Question.find(filterParams).sort(sortResults)
    return allQuestions
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getQuestionById = async (questionId) => {
  try {
    const question = await Question.findById(questionId).populate({ path: 'topic' })
    return question
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getQuestionSample = async (topicId, numQuestions) => {
  try {
    const questions = await Question.aggregate([
      { $match: { topic: topicId } },
      { $sample: { size: numQuestions } }
    ])

    return questions
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const createNewQuestion = async (newQuestion) => {
  try {
    const createdQuestion = new Question(newQuestion)
    createdQuestion.createdAt = new Date()
    createdQuestion.updatedAt = new Date()
    await Question.create(createdQuestion)
    return createdQuestion
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const updateOneQuestion = async (questionId, changes) => {
  try {
    const questionChanges = await Question.findById(questionId).exec()
    if (!questionChanges) {
      const dbError = new Error(`Can't find Question with the id '${questionId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    const topic = await Topic.findOne({ _id: changes.topic })

    if (changes.text) questionChanges.text = changes.text
    if (topic) questionChanges.topic = topic._id
    questionChanges.updatedAt = new Date()

    const updatedQuestion = await questionChanges.save()
    return updatedQuestion
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const deleteOneQuestion = async (questionId) => {
  try {
    await Question.findByIdAndDelete(questionId)
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getAllQuestionAnswers = async (questionId) => {
  try {
    const question = await Question.findById(questionId, 'answers')
    return question ? question.answers : null
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const addNewAnswer = async (questionId, newAnswer) => {
  try {
    const question = await Question.findById(questionId).exec()
    if (!question) {
      const dbError = new Error(`Can't find Question with the id '${questionId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    const existingAnswer = await Question.find(
      { _id: question._id, 'answers.text': newAnswer.text },
      { answers: { $elemMatch: { text: newAnswer.text } } }).exec()

    if (existingAnswer.length > 0) {
      const dbError = new Error(`Answer with text: '${newAnswer.text}' already exists for question with id: '${questionId}'`)
      throw Object.assign(dbError, { status: 400 })
    }

    question.answers.push(newAnswer)
    question.updatedAt = new Date()
    await question.save()

    let createdAnswer = await Question.find(
      { _id: question._id, 'answers.text': newAnswer.text },
      { answers: { $elemMatch: { text: newAnswer.text } } }).exec()

    createdAnswer = createdAnswer[0].answers[0]

    return createdAnswer
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const updateOneAnswer = async (questionId, answerId, changes) => {
  try {
    const question = await Question.findById(questionId).exec()
    if (!question) {
      const dbError = new Error(`Can't find Question with the id '${questionId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    const questionToUpdate = await Question.findOne({ _id: question._id, 'answers._id': answerId }).exec()
    if (!questionToUpdate) {
      const dbError = new Error(`Can't find Answer with the id '${answerId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    const isAlreadyAdded = questionToUpdate.answers.findIndex((answer) => (answer.text === changes.text)) > -1

    if (isAlreadyAdded && questionToUpdate.answers.id(answerId).text !== changes.text) {
      const dbError = new Error(`Answer with text: '${changes.text}' already exists for question with id: '${questionId}'`)
      throw Object.assign(dbError, { status: 400 })
    }

    changes.text = changes.text ? changes.text : questionToUpdate.answers.id(answerId).text
    changes.isCorrect = changes.isCorrect !== undefined
      ? changes.isCorrect
      : questionToUpdate.answers.id(answerId).isCorrect

    await Question.updateOne({ _id: questionId, 'answers._id': answerId }, {
      $set: {
        'answers.$.text': changes.text,
        'answers.$.isCorrect': changes.isCorrect,
        'answers.$.updatedAt': new Date(),
        updatedAt: new Date()
      }
    })

    let updatedAnswer = await Question.find(
      { _id: questionId, 'answers._id': answerId },
      { answers: { $elemMatch: { _id: answerId } } }).exec()

    updatedAnswer = updatedAnswer[0].answers[0]

    return updatedAnswer
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const deleteOneAnswer = async (questionId, answerId) => {
  try {
    const question = await Question.findById(questionId).exec()
    if (!question) {
      const dbError = new Error(`Can't find Question with the id '${questionId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    question.answers.pull({ _id: answerId })
    question.updatedAt = new Date()
    await question.save()

    return question
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

module.exports = {
  getAllQuestions,
  getQuestionById,
  getQuestionSample,
  createNewQuestion,
  updateOneQuestion,
  deleteOneQuestion,
  getAllQuestionAnswers,
  addNewAnswer,
  updateOneAnswer,
  deleteOneAnswer
}
