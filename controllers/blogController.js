const express = require("express");
const app = express();
const mongoose = require("mongoose");
const blogModel = require("../models/blogModel.js");
var cookieParser = require('cookie-parser')
app.use(cookieParser());
const path  = require("path");
const jwt = require("jsonwebtoken");
const userModel = require(path.join(__dirname, "../models/userModel.js"));

async function likeBlog(req, res){
    let blogid = req.params.blogid;
    let userid = req.body.userid;
    blogModel.findOne({_id: blogid}, (err, data)=> {
        if(!err){
            console.log(data.likes);
            data.likes = data.likes.concat({like: req.body.userid});
            data.save().then((response)=> {
                res.status(201).json(response);
            }).catch((error)=> {
                res.status(500).json(error)
            })
            
        }else{
            console.log(err);
        }
    })
}

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
const getBlogsByUserId = async(req, res)=> {
    try{
        const blogs = await blogModel.find({authorid: req.params.id});
        res.status(201).json(blogs);
    }catch(err){
       res.status(500).json(err);
    }
    
    
}


module.exports = {likeBlog, blogUpload, getall, getBlogsByUserId}