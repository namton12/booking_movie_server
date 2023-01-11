const expressAsyncHandler = require("express-async-handler");
const md5 = require("md5");
const { ROLE } = require("../constanis");
const User = require("../models/user.model");
var jwt = require("jsonwebtoken");
const JwtService = require("../services/jwt.service");
const tokenService = require("../services/token.service");
const connection = require("../db/init");
require("dotenv").config();

const register = expressAsyncHandler(async (req, res) => {
  try {
    const { username, password, email, phoneNumber, date, address } = req.body;

    //validate user
    if (
      (await User.findOne({ where: { email } })) ||
      (await User.findOne({ where: { phoneNumber } }))
    )
      throw new Error("email of phoneNumber is exsits");

    //Create wallet
    const walletInfo = await tokenService.createWallet();
    //crete user
    const user = new User({
      username,
      password: md5(password),
      email,
      phoneNumber,
      date,
      address,
      role: ROLE.USER,
      privateKey: walletInfo.privateKey,
      walletAddress: walletInfo.walletAddress,
    });
    console.info(walletInfo);
    await user.save();

    return res.json("Create user success");
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const login = expressAsyncHandler(async (req, res) => {
  try {
    const { password, email } = req.body;

    const user = await User.findOne({ where: { email } });

    // validate user
    if (!user) throw new Error("Email not found");
    if (user.dataValues.password !== md5(password))
      throw new Error("password not found");

    var token = JwtService.genarateToken({
      ...user.dataValues,
      password: null,
    });

    return res.json({
      userInfo: { ...user.dataValues, password: null },
      token: token,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const getAllUser = expressAsyncHandler(async (req, res) => {
  try {
    console.log(req.user);
    const users = await User.findAll({ attributes: { exclude: ["password"] } });

    return res.json(users);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const deleteUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const num = await User.destroy({ where: { id } });
    if (!num) throw new Error("no colection is deleted");
    return res.json(num);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const updateUser = expressAsyncHandler(async (req, res) => {
  try {
    const { id_user } = req.body;

    const { email, address, phoneNumber, username } = req.body;
    const user = await User.findOne({ where: { id: id_user } });
    const data = user.dataValues;

    const updateUser = await User.update(
      {
        username: username || data.username,
        email: email || data.email,
        address: address || data.address,
        phoneNumber: phoneNumber || data.phoneNumber,
      },
      { where: { id: id_user } }
    );
    const usernew = await User.findOne({ where: { id: id_user } });

    // update
    // user.username = username || data.username;
    // user.email = email || data.email;
    // user.password = md5(password) || data.password;
    // user.date = date || data.date;
    // user.address = address || data.address;
    // user.phoneNumber = phoneNumber || data.phoneNumber;``````````
    var token = JwtService.genarateToken({
      ...usernew.dataValues,
      password: null,
    });

    return res.json({ token });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const charge = expressAsyncHandler(async (req, res) => {
  const idUser = req.body.idUser;
  const userInfo = await User.findOne({ where: { id: idUser } });
  const chargeInfo = await tokenService.charge(
    userInfo.dataValues.walletAddress,
    500000
  );
  res.json({ chargeInfo });
});

const chargeHistory = expressAsyncHandler(async (req, res) => {
  const idUser = req.body.idUser;
  const userInfo = await User.findOne({ where: { id: idUser } });
  const history = await tokenService.chargeHistory(
    userInfo.dataValues.walletAddress
  );
  res.json({ history });
});

const buyHistory = expressAsyncHandler(async (req, res) => {
  const idUser = req.body.idUser;
  const userInfo = await User.findOne({ where: { id: idUser } });
  const history = await tokenService.buyHistory(
    userInfo.dataValues.walletAddress
  );
  res.json({ history });
});

const detailUser = expressAsyncHandler(async (req, res) => {
  const { id_user } = req.query;
  const [userInfo] = await connection.execute(
    "SELECT email, username, address, phoneNumber FROM users WHERE id= ?",
    [id_user]
  );
  return res.status(200).json({ ...userInfo[0] });
});

const historyBooking = expressAsyncHandler(async (req, res) => {
  try {
    const { userId } = req.query;
    const [booking] = await connection.execute(
      "SELECT books.seatIndex, books.id_book, books.idFilm, books.playTimeId, films.movieName, films.img, cinemas.address, playtimes.timeStart, cinemas.cinemaName FROM books INNER JOIN films on films.id = books.idFilm INNER JOIN playtimes ON playtimes.id = books.playTimeId INNER JOIN cinemas ON cinemas.id = films.CinemaId WHERE books.userId= ?",
      [userId]
    );
    return res.status(200).json(booking);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});
module.exports = {
  register,
  login,
  getAllUser,
  deleteUser,
  updateUser,
  charge,
  chargeHistory,
  buyHistory,
  detailUser,
  historyBooking,
};
