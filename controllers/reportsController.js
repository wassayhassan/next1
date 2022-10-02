const { response } = require("express");
const express = require("express");
const app = express;

const reportsModel = require('../models/reportModel');


const create = async(req, res) => {
    const report = new reportsModel(req.body);
    try{
        report.save().then((response)=> {
            res.status(200).json(response);
        })
    }catch(err){
        res.status(500).json(err);
    }

}
const findAll = async(req, res) => {
    let pageRequested = parseInt(req.params.page);
    pageRequested--;
    const pagelimit = 10;
    
    try{
        let totaldocuments = await reportsModel.countDocuments();
        const reports = await reportsModel.find().limit(10).skip(pagelimit * pageRequested);
        let totalpages = Math.ceil(totaldocuments/pagelimit);
        if(reports){
            pageRequested++;
            res.status(201).json({reports: reports,totalPages: totalpages, currentPage: pageRequested});
        }
    }catch(err){
        res.status(500).json(err);
    }

}
const update = async(req, res) => {
    console.log(req.body)
    try{
        reportsModel.findByIdAndUpdate(req.params.id, {solveStage: req.body.resolveStage, solved: req.body.resolveStatus}, (err, data)=> {
            if(!err){
                res.status(200).json(data)
            }else{
                res.status(500).json(err);
            }
        });
    }catch(err){
        res.status(500).json(err);
    }

      
}
const remove = async(req, res) => {
   reportsModel.findOneAndRemove(req.params.id, (err, data)=> {
    if(!err){
        res.status(200).json(data);
    }else{
        res.status(500).json(err);
    }
   })
}
const findById = async(req, res) => {
    try{
        const report  = await reportsModel.find(req.params.id);
        res.status(200).json(report);
    }catch(err){
        res.status(500).json(err);
    }

}

module.exports = {create, findAll, update, remove, findById}