const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');

const scoreSchema = new mongoose.Schema({
    name: String,
    score: Number
});

scoreSchema.plugin(mongodbErrorHandler);

module.exports = mongoose.model('Score', scoreSchema);
