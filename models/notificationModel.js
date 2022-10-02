const mongoose = require("mongoose");

const notiSchema = new mongoose.Schema({
    receiverId: String,
    senderId: String,
    postId: String,
    message : String
},
{
    timestamps: true
})

const notiModel = new mongoose.model('Notifications', notiSchema);
module.exports = notiModel;