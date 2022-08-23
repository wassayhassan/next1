const express = require("express");
const app = express();
const mongoose = require("mongoose");
const blogModel = require("../models/blogModel.js");
var cookieParser = require('cookie-parser')
app.use(cookieParser());
const path  = require("path");
const jwt = require("jsonwebtoken");
const userModel = require(path.join(__dirname, "../models/userModel.js"));

const blogUpload = async(req, res, next)=> {
   
    
    let imagesarray = req.files.map((im)=> {
          return {image: im.filename};
    });
    console.log(imagesarray);
   
    let usertoken = req.cookies.jwt_secure;
    let verify = jwt.verify(usertoken, process.env.SECRET_KEY);
    let user;
    if(verify){
        user = await userModel.findOne({_id: verify._id});
    }
    if(user){
        const blog = new blogModel({
           authorid: user._id,
           authorfirstname: user.firstname,
           authorlastname: user.lastname,
           title: req.body.title,
           blogData: req.body.blog,
           images: imagesarray,
           activeStatus: 'true'

        })
        blog.save().then((response)=> {
            res.status(201).json(response);
        }).catch((err)=> {
            console.log(err);
        })
       
         
    }
    
    
}
const getall = async(req, res)=> {
    const blogs = await blogModel.find();
    res.status(201).json(blogs);
}
module.exports = {blogUpload, getall}