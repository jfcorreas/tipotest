const mongoose = require('mongoose')

const Schema = mongoose.Schema

const AnswerSchema = new Schema(
  {
    text: { type: String, required: true },
    isCorrect: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, required: true, default: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) },
    updatedAt: { type: Date, required: true, default: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) }
  }
)
// TODO: add explanation to question's correct answer
const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    topic: { type: Schema.Types.ObjectId, ref: 'topic', required: true },
    answers: [AnswerSchema],
    createdAt: { type: Date, required: true, default: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) },
    updatedAt: { type: Date, required: true, default: new Date().toLocaleString('en-US', { timeZone: 'UTC' }) }
  }
)

QuestionSchema.index({ topic: 1 })
QuestionSchema.index({ text: 1 })
QuestionSchema.index({ text: 1, topic: 1 }, { unique: true })

const Question = mongoose.model('question', QuestionSchema)

module.exports = {
  Question,
  QuestionSchema
}
