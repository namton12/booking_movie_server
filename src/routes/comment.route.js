const { Router } = require("express");
const { createComment, getAllComment, getDetailComment, deleteComment } = require("../controllers/comment.controller");

const route = Router();

route.post("/create", createComment);
route.get("/", getAllComment);
route.get("/detail/:id", getDetailComment)
route.delete("/delete/:id", deleteComment)
module.exports = route;
