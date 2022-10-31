const { Convocation } = require('../database/schemas/ConvocationSchema')
const Topic = require('../database/schemas/TopicSchema')

const getAllConvocations = async (filterParams, sortResults = { year: -1 }) => {
  try {
    const allConvocations = await Convocation.find(filterParams).sort(sortResults)
    return allConvocations
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const getConvocationById = async (convocationId) => {
  try {
    const convocation = await Convocation.findById(convocationId).populate({ path: 'topicList' })
    return convocation
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const createNewConvocation = async (newConvocation) => {
  try {
    const createdConvocation = new Convocation(newConvocation)
    createdConvocation.updatedAt = new Date()
    createdConvocation.createdAt = new Date()
    await Convocation.create(createdConvocation)
    return createdConvocation
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const updateOneConvocation = async (convocationId, changes) => {
  try {
    const convocationToUpdate = await Convocation.findById(convocationId).exec()

    if (!convocationToUpdate) {
      const dbError = new Error(`Can't find Convocation with the id '${convocationId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    if (changes.name) convocationToUpdate.name = changes.name
    if (changes.year) convocationToUpdate.year = changes.year
    if (changes.institution) convocationToUpdate.institution = changes.institution
    if (changes.category) convocationToUpdate.category = changes.category
    convocationToUpdate.updatedAt = new Date()

    const updatedConvocation = await convocationToUpdate.save()
    return updatedConvocation
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const updateOneConvocationTopics = async (convocationId, topics) => {
  try {
    if (topics.constructor.name !== 'Array') {
      const dbError = new Error('Invalid list of topics')
      throw Object.assign(dbError, { status: 400 })
    }

    const convocationToUpdate = await Convocation.findById(convocationId).exec()

    if (!convocationToUpdate) {
      const dbError = new Error(`Can't find Convocation with the id '${convocationId}`)
      throw Object.assign(dbError, { status: 400 })
    }

    const uniqueTopics = new Set(topics)

    if (topics.length > uniqueTopics.size) {
      const dbError = new Error('Found duplicated topics')
      throw Object.assign(dbError, { status: 400 })
    }

    const existentTopics = await Topic.find({ _id: { $in: topics } }, '_id')
    const existentTopicsIds = existentTopics.map((topic) => {
      return topic._id.toString()
    })

    const topicsIds = topics.map((topic) => {
      return topic._id
    })

    const filteredTopics = topicsIds.filter((topicId) => existentTopicsIds.includes(topicId))

    convocationToUpdate.topicList = filteredTopics
    convocationToUpdate.updatedAt = new Date()

    const updatedConvocation = await convocationToUpdate.save()
    return updatedConvocation
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

const deleteOneConvocation = async (convocationId) => {
  try {
    await Convocation.deleteOne({ _id: convocationId })
  } catch (error) {
    const dbError = new Error(error?.message || error)
    throw Object.assign(dbError, { status: error?.status || 500 })
  }
}

module.exports = {
  getAllConvocations,
  getConvocationById,
  createNewConvocation,
  updateOneConvocation,
  updateOneConvocationTopics,
  deleteOneConvocation
}
