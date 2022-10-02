const mongoose = require("mongoose");

const ipSchema= new mongoose.Schema({
  idAddress: String,
},
{
    timestamps: true
})

const ipModal = new mongoose.model('ipAdresses', ipSchema);
module.exports = ipModal;