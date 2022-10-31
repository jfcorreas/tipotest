const { Test } = require('./schemas/TestSchema')

const getAllTests = async () => {
  try {
    const allTests = await Test.find({})
    return allTests
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getOneTest = async (testId, projection = null) => {
  try {
    const test = await Test.findById(testId, projection).exec()
    return test
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const createNewTest = async (newTest) => {
  try {
    const createdTest = new Test(newTest)
    createdTest.createdAt = new Date()
    createdTest.updatedAt = new Date()
    await Test.create(createdTest)
    return createdTest
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const completeOneTest = async (testId, testResponses, newScore) => {
  try {
    const completedTest = await Test.findById(testId).exec()
    if (!completedTest) {
      const reqError = new Error(`Can't find Test with the id '${testId}`)
      throw Object.assign(reqError, { status: 400 })
    }

    if (testResponses) completedTest.responses = testResponses
    if (newScore >= 0) completedTest.score = newScore
    completedTest.submitted = true
    completedTest.updatedAt = new Date()

    const updatedTest = await completedTest.save()
    return updatedTest
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const deleteOneTest = async (testId) => {
  try {
    await Test.findByIdAndDelete(testId)
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

module.exports = {
  getAllTests,
  getOneTest,
  createNewTest,
  completeOneTest,
  deleteOneTest
}
