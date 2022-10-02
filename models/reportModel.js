const mongoose = require("mongoose");

const reportsSchema= new mongoose.Schema({
    userId: String,
    postId: String,
    message : String,
    solveStage: String,
    solved: String
},
{
    timestamps: true
})

const reportsModel = new mongoose.model('Reports', reportsSchema);
module.exports = reportsModel;