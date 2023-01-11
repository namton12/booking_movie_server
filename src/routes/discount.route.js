const { Router } = require("express");
const { getAllDiscount, updateDiscount, detailDiscount, createDiscount, discountByFilm } = require("../controllers/discount.controller");

const route = Router();

route.get("/", getAllDiscount)
route.patch("/update/:id", updateDiscount)
route.get("/detail/:id", detailDiscount)
route.post("/create", createDiscount)
route.get("/by/film", discountByFilm)

module.exports= route