const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TopicTestSchema = new Schema(
    {
        topicId: { type: Schema.Types.ObjectId, ref: 'topic' },
        testId: { type: Schema.Types.ObjectId, ref: 'test' }
    }
);

TopicTestSchema.index({ topicId: 1, testId:1 }, { unique: true });

const TopicTest = mongoose.model('topictest', TopicTestSchema);

module.exports = {
    TopicTest
};