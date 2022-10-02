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
    console.log(blogs)
    blogs.sort(function(a, b){
        return b.createdAt - a.createdAt;
    })
    res.status(201).json(blogs);
}

const getBlogsByPage = async(req, res) => {
    let pageRequested = parseInt(req.params.page);
    pageRequested--;
    const pagelimit = 10;
    
    try{
        let totaldocuments = await blogModel.countDocuments();
        const blogs = await blogModel.find().limit(10).skip(pagelimit * pageRequested).sort({createdAt: 'desc'});
        let totalpages = Math.ceil(totaldocuments/pagelimit);
        if(blogs){

            console.log(blogs)
            pageRequested++;
            res.status(201).json({blogs: blogs,pages: totalpages, currentpage: pageRequested});
        }
    }catch(err){
        res.status(500).json(err);
    }

    
}
const blogStatusChange = async(req, res) => {
  try{
    let data = {
        activeStatus: JSON.stringify(req.body.activeStatus),
    }
    console.log(data);
     const blog = await blogModel.findOneAndUpdate({_id: req.body.postid},data);
     if(blog){
      res.status(201).json(blog);
     }else{
        res.status(500).json('Blog Not Found');
     }
    
  }catch(err){
    res.status(500).json(err);
    console.log(err)
  }
} 

const getBlogsByUserId = async(req, res)=> {

    let pageRequested = parseInt(req.params.page);
    pageRequested--;
    const pagelimit = 10; 
    try{
        let totaldocuments = await blogModel.countDocuments();
        const blogs = await blogModel.find({authorid: req.params.id}).limit(10).skip(pagelimit * pageRequested).sort({createdAt: 'desc'});
        let totalpages = Math.ceil(totaldocuments/pagelimit);
        if(blogs){

            pageRequested++;
            res.status(201).json({blogs: blogs,pages: totalpages, currentpage: pageRequested});
        }
    }catch(err){
        res.status(500).json(err);
    }
    
}
const getBlogCount = async(req, res)=> {
    try{
      const count  = await blogModel.countDocuments();
      res.status(201).json(count);
    }catch(err){
        res.status(500).json(err)
    }
}
const searchBlogs = async(req, res)=> {
    let searchkey = req.body.searchkey;
    try{
      const blogs = await blogModel.find({"blogData": {$regex: searchkey, $options: 'i'}}).sort({createdAt: 'desc'});

      res.status(201).json(blogs);
    }catch(err){
        console.log(err);
        res.status(500).json(err)
    }
}
async function getBlog(req, res){
   try{
     const blog  = await blogModel.findOne({_id: req.params.id});
     res.status(200).json(blog);
   }catch(err){
    res.status(500).json(err)
   }
}

module.exports = {likeBlog, blogUpload, getall, getBlogsByPage, getBlogsByUserId, blogStatusChange, getBlogCount, searchBlogs, getBlog};