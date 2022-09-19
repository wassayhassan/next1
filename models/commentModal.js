const express = require("express");
const app = express();
const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({

   blogid: String,
   authorid: String,
   comment: String,
   activeStatus: String,

   
}, {
    timestamps: true
});



const commentModal = new mongoose.model("Comments", commentSchema);

module.exports = commentModal;