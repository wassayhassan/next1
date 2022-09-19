const express = require("express");
const app = express();
const api = express.Router();
const {userLogin, userRegister,logoutUser, getUserToken, getUserData, getDataById, profileUpdate, getSearchUsers, friendsAdd} = require("../controllers/userController.js");
const multer  = require('multer');
const {likeBlog, blogUpload, getall, getBlogsByUserId} = require("../controllers/blogController.js");
const {getPhoto} = require("../controllers/photoController");
const {createCoversation, getCoverssationById, createMessage, findMsgsByConId, findConversation} = require("../controllers/chatController");
const {createComment, findCommentsByBlogId} = require("../controllers/commentController")


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'uploads/')
    }
    ,
    filename: function (req, file, cb) {
        let extArray = file.mimetype.split("/");    
        let extension = extArray[extArray.length - 1];
        cb(null, file.fieldname + '-' + Date.now()+ '.' +extension)
      }
})
const upload = multer({ storage: storage })


api.post("/user/register", userRegister);
api.post("/user/login", userLogin);
api.post("/user/logout", logoutUser);
api.post('/user/data/:id', getDataById);
api.post("/user/data", getUserData);
api.post("/user/token", getUserToken);
api.post('/users/getbyname/:name', getSearchUsers)
api.post('/user/addfriend',friendsAdd);
api.post('/blogs/upload',upload.array('images'), blogUpload)
api.post('/blogs/getall',getall);
api.post('/user/blogs/:id', getBlogsByUserId);

api.get('/user/photo/:id', getPhoto);
const cpUpload = upload.fields([{name: 'profilepic', maxCount: 1}, {name: 'headerpic', maxCount: 1}]);
api.post('/user/profile/edit', cpUpload,profileUpdate)



api.post("/chat/createconversation", createCoversation);
api.post("/chat/conversations/:id", getCoverssationById);
api.post('/chat/findcoversation/:id', findConversation);
api.post("/chat/newmessage", createMessage);
api.post("/chat/conversation/:conversationId", findMsgsByConId);

//comment api's

api.post('/blog/createcomment', createComment);
api.post('/blog/comments/:blogid',findCommentsByBlogId);

//like api

api.post('/blog/like/:blogid', likeBlog)

module.exports = api;
