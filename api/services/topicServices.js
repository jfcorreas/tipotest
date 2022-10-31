const Topic = require('../database/Topic')
const TopicTest = require('../database/TopicTest')

const getAllTopics = async (filterParams) => {
  const allTopics = await Topic.getAllTopics(filterParams)
  return allTopics
}

const getTopicTests = async (topicId) => {
  const topicTests = await TopicTest.getTopicTests(topicId)
  return topicTests
}

const getExistingTopics = async (topicIds) => {
  const existingTopics = await Topic.getExistingTopics(topicIds)
  return existingTopics
}

const getTopicById = async (topicId) => {
  const topic = Topic.getTopicById(topicId)
  return topic
}

const createNewTopic = async (newTopic) => {
  const createdTopic = await Topic.createNewTopic(newTopic)
  return createdTopic
}

const updateOneTopic = async (topicId, changes) => {
  const updatedTopic = await Topic.updateOneTopic(topicId, changes)
  return updatedTopic
}

const deleteOneTopic = async (topicId) => {
  await Topic.deleteOneTopic(topicId)
  await TopicTest.deleteTopicTests(topicId)
}

module.exports = {
  getAllTopics,
  getTopicTests,
  getExistingTopics,
  getTopicById,
  createNewTopic,
  updateOneTopic,
  deleteOneTopic
}
