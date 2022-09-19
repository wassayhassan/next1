const express = require("express");
const app = express();
const mongoose = require("mongoose");

const messagesSchema = new mongoose.Schema({
    conversationId: String,
    senderId: String,
    receiverId: String,
    text: String,
}, {
    timestamps: true
});



const messagesModel = new mongoose.model("Messages", messagesSchema);

module.exports = messagesModel;