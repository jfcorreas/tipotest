const Convocation = require('../database/Convocation')

const getAllConvocations = async (filterParams, sortResults) => {
  const allConvocations = await Convocation.getAllConvocations(filterParams, sortResults)
  return allConvocations
}

const getConvocationById = async (convocationId) => {
  const convocationReq = await Convocation.getConvocationById(convocationId)
  return convocationReq
}

const createNewConvocation = async (newConvocation) => {
  const createdConvocation = await Convocation.createNewConvocation(newConvocation)
  return createdConvocation
}

const updateOneConvocation = async (convocationId, changes) => {
  const updatedConvocation = await Convocation.updateOneConvocation(convocationId, changes)
  return updatedConvocation
}

const updateOneConvocationTopics = async (convocationId, topics) => {
  const updatedConvocation = await Convocation.updateOneConvocationTopics(convocationId, topics)
  return updatedConvocation
}

const deleteOneConvocation = async (convocationId) => {
  await Convocation.deleteOneConvocation(convocationId)
}

module.exports = {
  getAllConvocations,
  getConvocationById,
  createNewConvocation,
  updateOneConvocation,
  updateOneConvocationTopics,
  deleteOneConvocation
}
