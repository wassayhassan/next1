const express = require("express");
const app = express;
const conversationModel =  require("../models/conversationModel")
const messageModel  = require("../models/messageModel");

async function createCoversation(req,res)
{
    let senderId  = req.body.senderId;
    let receiverId = req.body.receiverId;
    let members  =[senderId, receiverId];
   let conversation = new conversationModel({
    members: members
   })
   try{
    let response = await conversation.save();
    res.status(201).json(response);
   }catch(err){
    res.status(500).json(err);
   }
}
async function getCoverssationById(req, res){
    let id = req.params.id;
    try{
        const converses = await conversationModel.find({members: {$in: [id]}});
        res.status(201).json(converses);
        
    }catch(err){
        res.status(500).json(err);
    }
    
}
async function createMessage(req,res){
    const message = new messageModel(req.body);
    try{
       let response = await message.save();
       res.status(201).json(response)
    }catch(err){
        console.log(err);
    }
}
async function findMsgsByConId(req, res){
    let conversationId = req.params.conversationId;
    try{
      let response = await messageModel.find({conversationId: conversationId});
      res.status(201).json(response)
    }catch(err){
        res.status(500).json(err);
    }
}
async function findConversation(req, res){
    let conversationId = req.params.id;
    try{
      let response = await conversationModel.findById({_id: conversationId});
      res.status(201).json(response)
    }catch(err){
        res.status(500).json(err);
    }
}
const deleteConversation = (req, res)=> {
  try{
    console.log(req.params.id);
     conversationModel.findByIdAndRemove(req.params.id, (err, data)=> {
        if(!err){
            res.status(200).json({data, error: "false"});
        }else{
            res.status(500).json({err, error: "true"})
        }
     });
  }catch(err){
    res.status(500).json(err)
  }
}



module.exports = {createCoversation, getCoverssationById, createMessage, findMsgsByConId, findConversation, deleteConversation}