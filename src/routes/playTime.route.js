const { Router } = require("express");
const { ROLE } = require("../constanis");
const {
  getAllPlayTime,
  createPlayTime,
  updatePlayTime,
  getDetailPlayTimeByCluster,
  detailPlaytime
} = require("../controllers/playTime.controller");

const authorize = require("../middlewares/auth.middleware");

const route = Router();

route.get("/", getAllPlayTime);
route.post("/create", createPlayTime);
route.patch("/update/:id", updatePlayTime);
route.get("/detail/:id", detailPlaytime)
route.get("/detail/playtimes/:filmId", getDetailPlayTimeByCluster)

module.exports = route;
