const mongoose = require('mongoose');
const {Schema, model:Model} = mongoose;
const {String, Number, ObjectId} = Schema.Types;


const modelSchema = new Schema({
    //TODO
});

module.exports = new Model('Model', modelSchema);