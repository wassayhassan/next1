const express = require("express");
const app = express;

async function getPhoto(req, res){
   const rootpath = './';
   console.log(req.params.id);
    res.sendFile( `/uploads/${req.params.id}`, { root: rootpath });
// const fileName = req.params.id;
//   const directoryPath = rootpath + "/uploads/";
//   res.download(directoryPath + fileName, fileName, (err) => {
//     if (err) {
//       res.status(500).send({
//         message: "Could not download the file. " + err,
//       });
//     }
//   });
}
module.exports = {getPhoto}