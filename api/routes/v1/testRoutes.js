const express = require('express')
const testController = require('../../controllers/testController')

const router = express.Router()

router
  .get('/', testController.getAllTests)
  .post('/', testController.createNewTest)
  .patch('/:testId', testController.completeOneTest)
  .delete('/:testId', testController.deleteOneTest)
  .get('/:testId/topics', testController.getTestTopics)

module.exports = router
