const express = require("express");
const routes = express();
const forumController = require("../controller/forumController");

routes.post("/create", forumController.createComment);
routes.post("/reply", forumController.reply);
routes.get("/get-discussion/:courseId", forumController.getDiscussion);
routes.delete("/delete-comment/:commentId", forumController.deleteComment);
routes.delete("/delete-reply/:commentId/:replyId", forumController.deleteReply);

module.exports = routes;
