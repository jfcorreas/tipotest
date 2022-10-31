
const Topic = require('../database/schemas/TopicSchema')
const { Question } = require('../database/schemas/QuestionSchema')

const getAllTopics = async (filterParams, sortResults = { shorthand: 1 }) => {
  try {
    const allTopics = await Topic.find(filterParams).sort(sortResults)
    return allTopics
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getExistingTopics = async (topicIds) => {
  try {
    const existingTopics = await Topic.find({ _id: { $in: topicIds } }, '_id')
    return existingTopics
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getTopicById = async (topicId) => {
  try {
    const topic = await Topic.findById(topicId)
    return topic
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const createNewTopic = async (newTopic) => {
  try {
    const createdTopic = new Topic(newTopic)
    createdTopic.createdAt = new Date()
    createdTopic.updatedAt = new Date()
    await Topic.create(createdTopic)
    return createdTopic
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const updateOneTopic = async (topicId, changes) => {
  try {
    const topicToUpdate = await Topic.findById(topicId).exec()

    if (!topicToUpdate) {
      const reqError = new Error(`Can't find Topic with the id '${topicId}`)
      throw Object.assign(reqError, { status: 400 })
    }

    if (changes.title) topicToUpdate.title = changes.title
    if (changes.shorthand) topicToUpdate.shorthand = changes.shorthand
    if (changes.fullTitle) topicToUpdate.fullTitle = changes.fullTitle
    topicToUpdate.updatedAt = new Date()

    const updatedTocic = await topicToUpdate.save()
    return updatedTocic
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const deleteOneTopic = async (topicId) => {
  try {
    const questions = await Question.find({ topic: topicId })
    if (questions.length > 0) {
      const reqError = new Error(`Can't delete Topic with the id '${topicId}: there are questions associated with it `)
      throw Object.assign(reqError, { status: 400 })
    }
    await Topic.deleteOne({ _id: topicId })
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

module.exports = {
  getAllTopics,
  getExistingTopics,
  getTopicById,
  createNewTopic,
  updateOneTopic,
  deleteOneTopic
}
