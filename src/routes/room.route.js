const { Router } = require("express");
const {
  createRoom,
  deleteRoom,
  getAllRoomByCinema,
  getAllRoom,
  getRoomByCinema,
  detailRoom,
  updateRoom,
  getAvailableRoom,
} = require("../controllers/room.controller");

const route = Router();

route.post("/create", createRoom);
route.delete("/delete/:id", deleteRoom);
route.get("/cinema/:id", getAllRoomByCinema);
route.get("/", getAllRoom);
route.get("/get_room/by/cinema/:idCinema/:idFilm", getRoomByCinema)
route.get("/detail/:id", detailRoom)
route.patch("/update/:id", updateRoom)
route.get("/available/by/cinema", getAvailableRoom)


module.exports = route;
