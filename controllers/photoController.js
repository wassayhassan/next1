const express = require("express");
const app = express;

async function getPhoto(req, res){
   const rootpath = './';
   console.log(req.params.id);
    res.sendFile( `/uploads/${req.params.id}`, { root: rootpath });
}
module.exports = {getPhoto}