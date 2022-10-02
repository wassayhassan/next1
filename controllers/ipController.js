const express  = require('express');
const app = express();
const ipModal = require('../models/ipModal')

const saveIp = async(req, res, next) => {
  try{
    const ip = new ipModal({ idAddress: req.ip});
    ip.save().then((response)=> {
        next();
    })
  }catch(err){
    res.status(500).json(err);
  }
}

const countIps = async(req, res)=> {
    console.log('sdsd')
    try{
        const total = await ipModal.countDocuments();
        console.log(total);
        res.status(200).json(parseInt(total));
    }catch(err){
        res.status(500).json(err);
    }

}
module.exports = {saveIp, countIps}