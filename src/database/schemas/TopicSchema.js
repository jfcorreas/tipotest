const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TopicSchema = new Schema(
    {
        title: { type: String, required: true},
        shorthand: { type: String, required: true},
        fullTitle: { type: String, required: false},
        createdAt: { type: Date, required: true, default: new Date().toLocaleString("en-US", { timeZone: "UTC"})},
        updatedAt: { type: Date, required: true, default: new Date().toLocaleString("en-US", { timeZone: "UTC"})}
    }
);

const Topic = mongoose.model('topic', TopicSchema);

module.exports = Topic;