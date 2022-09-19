const express = require("express");
const app = express;
const path = require('path');
const mongoose = require("mongoose");
const commentModal = require(path.join(__dirname, "../models/commentModal.js"));


async function createComment(req, res){
   console.log(req.body);
   let comment  = new commentModal({
    authorid: req.body.authorid,
    blogid: req.body.blogid,
    comment: req.body.comment,
    activeStatus: 'true'
   }) 
   comment.save().then((response)=> {
    res.status(201).json(response); 
   }).catch((err)=>{
    console.log(err);
    res.status(500).json(err);
   }
   )
}

async function findCommentsByBlogId(req, res){
    console.log("findComments called");
    let blogid = req.params.blogid;
    console.log(blogid);
    commentModal.find({blogid: blogid}).then((response)=> {
         res.status(201).json(response);
    }).catch((err)=> {
         res.status(500).json(err);
    })
}


module.exports = {createComment, findCommentsByBlogId}