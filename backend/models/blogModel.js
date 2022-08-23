const express = require("express");
const app = express();
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({

    authorid: String,
    authorfirstname: String,
    authorlastname: String,
    title: String,
    blogData: String,
    images: [
        {
            image: String
        }
    ],
    activeStatus: String,

   
}, {
    timestamps: true
});



const blogModel = new mongoose.model("Blogs", blogSchema);

module.exports = blogModel;