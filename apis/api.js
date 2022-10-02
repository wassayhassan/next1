const express = require("express");
const app = express();
const api = express.Router();
const {userLogin, userRegister,logoutUser, getUserToken, getUserData, getDataById, profileUpdate, getSearchUsers, friendsAdd,  getAllUsers, getUserDataByToken, getUserCount, updateUserStatus,  getUsersByPage, sendVerificationCodeByEmail, updateVerificationStatus, getUserFriends, removeFriend} = require("../controllers/userController.js");
const multer  = require('multer');
const {likeBlog, blogUpload, getall, getBlogsByPage, getBlogsByUserId, blogStatusChange, getBlogCount, searchBlogs, getBlog} = require("../controllers/blogController.js");
const {getPhoto} = require("../controllers/photoController");
const {createCoversation, getCoverssationById, createMessage, findMsgsByConId, findConversation, deleteConversation} = require("../controllers/chatController");
const {createComment, findCommentsByBlogId} = require("../controllers/commentController")
const {createnoti, getNotificationsById, createShareNoti } = require("../controllers/notiController");
const { create, findAll, update, remove, findById } = require('../controllers/reportsController');
const { countIps } = require('../controllers/ipController');
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
api.post('/user/verification/code', sendVerificationCodeByEmail);
api.post('/user/update/verificationstatus', updateVerificationStatus);
api.post("/user/register", userRegister);
api.post('/users/getall', getAllUsers);
api.post('/users/get/:page', getUsersByPage)
api.post("/user/login", userLogin);
api.post("/user/logout", logoutUser);
api.post('/user/count', getUserCount)
api.post('/user/data/:id', getDataById);
api.post('/user/databytoken/:token', getUserDataByToken )
api.post("/user/data", getUserData);
api.post("/user/token", getUserToken);
api.post('/user/update', updateUserStatus)
api.post('/users/getbyname/:name', getSearchUsers)
api.post('/user/addfriend',friendsAdd);
api.post('/user/removefriend', removeFriend)
api.post('/blogs/upload',upload.array('images'), blogUpload)
api.post('/blogs/getall',getall);
api.post('/blog/statuschange', blogStatusChange);
api.post('/blogs/get/:page', getBlogsByPage)
api.post('/blog/count', getBlogCount)
api.post('/user/blogs/:id/:page', getBlogsByUserId);
api.post('/blogs/search/searchkey',searchBlogs)
api.get('/blog/:id', getBlog);
api.get('/user/:id/friends', getUserFriends);

api.get('/user/photo/:id', getPhoto);
const cpUpload = upload.fields([{name: 'profilepic', maxCount: 1}, {name: 'headerpic', maxCount: 1}]);
api.post('/user/profile/edit', cpUpload,profileUpdate)


api.delete('/chat/conversation/:id', deleteConversation)
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

//notification api

api.post('/notification/create', createnoti);
api.post('/notification/share/create', createShareNoti)
api.post('/notification/getbyuserid', getNotificationsById);


//reports apis

api.post('/report/create', create);
api.get('/reports/:id', findById);
api.get('/reports/get/:page', findAll);
api.delete('/report/:id', remove);
api.patch('/report/:id', update);

//ips api

api.post('/ips/count', countIps)


module.exports = api;
