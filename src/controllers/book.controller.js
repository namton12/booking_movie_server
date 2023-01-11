const expressAsyncHandler = require("express-async-handler");
const Book = require("../models/book.model");
const Film = require("../models/film.model");
const PlayTime = require("../models/PlayTime.model");
const Room = require("../models/rom.model");
const User = require("../models/user.model");
const Cinema = require("../models/Cinema.model");
const tokenService = require("../services/token.service");
const connection = require("../db/init");
const { v4 } = require("uuid");
const moment = require("moment");
const { json } = require("sequelize");

const createBook = expressAsyncHandler(async (req, res) => {
  try {
    const playTimeInfo = await PlayTime.findOne({
      where: { id: req.body.playTimeId },
    });

    const userInfo = await User.findOne({
      where: { id: req.body.userId },
    });
    const filmInfo = await Film.findOne({
      where: { id: playTimeInfo.dataValues.filmId },
    });
    const roomInfo = await Room.findOne({
      where: { id: playTimeInfo.dataValues.roomId },
    });
    const cinemaInfo = await Cinema.findOne({
      where: { id: roomInfo.dataValues.cinemaId },
    });
    const txInfo = await tokenService.buy(
      filmInfo.dataValues.contractAddress,
      userInfo.dataValues.walletAddress,
      cinemaInfo.dataValues.clusterId + "",
      cinemaInfo.dataValues.id + "",
      roomInfo.dataValues.id + "",
      req.body.seatIndex + "",
      new Date(playTimeInfo.dataValues.timeStart).getTime()
    );
    req.body.txId = txInfo.transactionHash;
    req.body.dateStart = playTimeInfo.dataValues.timeStart;
    const data = await Book.create(req.body);
    //blockchain
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBookByFilm = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findAll({
      where: { filmId: id },
      include: [{ model: PlayTime }, { model: User }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBook = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Book.findAll({
      include: [{ model: PlayTime, include: Room }, { model: User }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBookByRoom = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findAll({
      where: { roomId: id },
      include: [{ model: PlayTime, include: Room }, { model: User }],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllBookById = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.findAll({ where: { id: id } });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const deteteBook = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Book.destroy({ where: { id } });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const booking = expressAsyncHandler(async (req, res) => {
  try {
    //Get info
    const playTimeInfo = await PlayTime.findOne({
      where: { id: req.body.playTimeId },
    });
    const userInfo = await User.findOne({
      where: { id: req.body.userId },
    });
    const filmInfo = await Film.findOne({
      where: { id: playTimeInfo.dataValues.filmId },
    });
    const roomInfo = await Room.findOne({
      where: { id: req.body.id_room },
    });
    const cinemaInfo = await Cinema.findOne({
      where: { id: roomInfo.dataValues.cinemaId },
    });
    const fee = 0;
    const txInfo = await tokenService.buy(
      filmInfo.dataValues.contractAddress,
      userInfo.dataValues.privateKey,
      cinemaInfo.dataValues.id + "",
      req.body.id_room + "",
      req.body.seatIndex + "",
      new Date(playTimeInfo.dataValues.timeStart).getTime(),
      fee
    );
    const [insertBook] = await connection.execute(
      "INSERT INTO books(dateStart, playTimeId, idFilm, userId, seatIndex, id_room, id_book, time_created, txId) VALUES(?, ?, ?, ?,?, ?, ?, ?, ?)",
      [
        req.body.dateStart,
        req.body.playTimeId,
        req.body.idFilm,
        req.body.userId,
        req.body.seatIndex,
        req.body.id_room,
        req.body.id_book,
        req.body.time_created,
        txInfo.transactionHash,
      ]
    );
    const [updateSeat] = await connection.execute(
      "UPDATE rooms set seated= seated + 1 WHERE rooms.id= ?",
      [req.body.id_room]
    );
    return res.status(200).json({ ...insertBook, id_book: req.body.id_book });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const bookingTicket = expressAsyncHandler(async (req, res) => {
  try {
    const [rows] = await connection.execute(
      "SELECT books.idFilm, playtimes.timeStart, rooms.RoomName, rooms.address, cinemas.cinemaName, films.movieName, films.price, films.img, films.desc FROM books INNER JOIN playtimes ON books.playtimeId= playtimes.id INNER JOIN films ON playtimes.filmId = films.id INNER JOIN cinemas ON films.CinemaId = cinemas.id INNER JOIN rooms ON rooms.cinemaId = cinemas.id WHERE books.id_book= ? LIMIT 1 ",
      [req.query.id_book]
    );

    const [seat] = await connection.execute(
      "SELECT books.seatIndex FROM books WHERE id_book= ?",
      [req.query.id_book]
    );
    return res.status(200).json({ ...rows[0], seat: seat });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const stats = expressAsyncHandler(async (req, res) => {
  try {
    const [row1] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).format("DD-MM-YYYY")]
    );
    const [row2] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).subtract(1, "days").format("DD-MM-YYYY")]
    );
    const [row3] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).subtract(2, "days").format("DD-MM-YYYY")]
    );
    const [row4] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).subtract(3, "days").format("DD-MM-YYYY")]
    );
    const [row5] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).subtract(4, "days").format("DD-MM-YYYY")]
    );
    const [row6] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).subtract(5, "days").format("DD-MM-YYYY")]
    );
    const [row7] = await connection.execute(
      "SELECT SUM(films.price) AS revenue FROM books INNER JOIN films ON books.idFilm = films.id WHERE time_created= ?",
      [moment(new Date()).subtract(6, "days").format("DD-MM-YYYY")]
    );
    const [row8] = await connection.execute(
      "SELECT films.price, books.time_created AS revenue FROM books INNER JOIN films ON books.idFilm = films.id"
    );
    return res.status(200).json({
      last7days: [
        row7?.[0]?.revenue || 0,
        row6?.[0]?.revenue || 0,
        row5?.[0]?.revenue || 0,
        row4?.[0]?.revenue || 0,
        row3?.[0]?.revenue || 0,
        row2?.[0]?.revenue || 0,
        row1?.[0]?.revenue || 0,
      ],
      revenue: row8,
    });
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

module.exports = {
  createBook,
  deteteBook,
  getAllBookByFilm,
  getAllBookByRoom,
  getAllBookById,
  getAllBook,
  booking,
  bookingTicket,
  stats,
};
