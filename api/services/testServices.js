const Test = require('../database/Test')
const Convocation = require('../database/Convocation')
const Topic = require('../database/Topic')
const TopicTest = require('../database/TopicTest')
const Question = require('../database/Question')
const questionService = require('./questionServices')

const getAllTests = async () => {
  const allTests = await Test.getAllTests()
  return allTests
}

const getTestTopics = async (testId) => {
  const testTopics = await TopicTest.getTestTopics(testId)
  return testTopics
}

const getQuestionsForTest = async (topicId, numQuestions, numAnswers) => {
  const questionsSample = await Question.getQuestionSample(topicId, numQuestions)

  for (const question of questionsSample) {
    question.answers = await questionService.getQuestionAnswers(question._id, numAnswers, false)

    if (!question.answers) {
      const badQuestionIndex = questionsSample.findIndex((element) => element.id === question.id)
      questionsSample.splice(badQuestionIndex, 1)
    }
  }
  return questionsSample
}

const createNewTest = async (newTest, topicList, numQuestions) => {
  const convocation = await Convocation.getConvocationById(newTest.convocationId)

  let validTopics = []

  if (topicList) {
    validTopics = await Topic.getExistingTopics(topicList)
    validTopics = validTopics.map((topic) => {
      return topic._id
    })
  }

  if (!convocation && validTopics.length < 1) {
    const dbError = new Error('No topics available for the Test')
    throw Object.assign(dbError, { status: 400 })
  }

  let topicsForTest = []
  if (convocation) {
    topicsForTest = topicsForTest.concat(convocation.topicList)
    topicsForTest = topicsForTest.map((topic) => {
      return topic._id
    })
  }
  if (convocation && validTopics.length > 0) {
    topicsForTest = topicsForTest.filter(topic => validTopics.includes(topic))
  }

  if (topicsForTest.length === 0) {
    const dbError = new Error('No topics available for the Test')
    throw Object.assign(dbError, { status: 400 })
  }
  // FIXME: suffle questionsForTest and complete if there are topics with few questions
  let questionsForTest = []
  for (const topic of topicsForTest) {
    const selectedQuestions = await getQuestionsForTest(topic, numQuestions / topicsForTest.length, newTest.numChoices)
    questionsForTest = questionsForTest.concat(selectedQuestions)
  }

  if (questionsForTest.length < 1) {
    const dbError = new Error(`No questions available with ${newTest.numChoices} answers for the Test`)
    throw Object.assign(dbError, { status: 400 })
  }

  newTest.questionList = questionsForTest
  const createdTest = await Test.createNewTest(newTest)

  const newTopicsForTest = topicsForTest.map(topicId => {
    return { topicId, testId: createdTest._id }
  })
  await TopicTest.createNewTopicsForTest(newTopicsForTest)

  return createdTest
}

const completeOneTest = async (testId, testResponses) => {
  const undoneTest = await Test.getOneTest(testId, 'questionList numChoices scoringFormula')
  if (!undoneTest) {
    const dbError = new Error(`Can't find Test with the id '${testId}`)
    throw Object.assign(dbError, { status: 400 })
  }

  if (!testResponses ||
            testResponses.constructor.name !== 'Array' ||
            testResponses.length !== undoneTest.questionList.length ||
            !testResponses.every((choice) => choice < undoneTest.numChoices)) {
    const dbError = new Error('Not valid or incomplete responses submitted')
    throw Object.assign(dbError, { status: 400 })
  }

  let hits = 0; let faults = 0
  testResponses.forEach((choice, index) => {
    if (choice !== null &&
                 choice >= 0 &&
                 choice < undoneTest.numChoices) {
      if (undoneTest.questionList[index].answers[choice].isCorrect) {
        hits++
      } else {
        faults++
      }
    }
  })

  let newScore = 0
  switch (undoneTest.scoringFormula) {
    case 'H-(F/4)':
    default: newScore = hits - (faults / 4)
  }

  if (newScore < 0) newScore = 0

  const completedTest = await Test.completeOneTest(testId, testResponses, newScore)
  return completedTest
}

const deleteOneTest = async (testId) => {
  await Test.deleteOneTest(testId)
  await TopicTest.deleteTestTopics(testId)
}

module.exports = {
  getAllTests,
  getTestTopics,
  createNewTest,
  completeOneTest,
  deleteOneTest
}
