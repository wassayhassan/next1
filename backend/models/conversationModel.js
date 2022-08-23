const express = require("express");
const app = express();
const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    members: Array
}, {
    timestamps: true
});



const conversationModel = new mongoose.model("Conversations", conversationSchema);

module.exports = conversationModel;