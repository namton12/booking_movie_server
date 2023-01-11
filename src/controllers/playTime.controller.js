const expressAsyncHandler = require("express-async-handler");
const connection = require("../db/init");
const Film = require("../models/film.model");
const PlayTime = require("../models/PlayTime.model");
require("dotenv").config();

const getAllPlayTime = expressAsyncHandler(async (req, res) => {
  try {
    const playTimes = await PlayTime.findAll({ include: Film});
    return res.json(playTimes);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
const updatePlayTime = expressAsyncHandler(async (req, res) => {
  try {
    console.log(req.params.id)
    const data = await PlayTime.update(
      { ...req.body },
      { where: { id: req.params.id } }
    );

    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const createPlayTime = expressAsyncHandler(async (req, res) => {
  try {
    const playTime = await PlayTime.create(req.body);
    return res.json(playTime);
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});

const detailPlaytime= expressAsyncHandler(async (req, res)=> {
  try {
    const {id}= req.params
    const [detailPlaytime]= await connection.execute("SELECT playtimes.timeStart, films.movieName, playtimes.filmId FROM playtimes INNER JOIN films ON playtimes.filmId = films.id WHERE playtimes.id= ?", [id])
    return res.status(200).json(detailPlaytime[0])
  } catch (error) {
    return res.status(400).json({ message: error.message });
    
  }
})

const getDetailPlayTimeByCluster= expressAsyncHandler(async(req, res)=> {
  try {
    const {filmId}= req.params
    const [rows]= await connection.execute("SELECT DISTINCT playtimes.timeStart, playtimes.id FROM playtimes INNER JOIN films ON films.id = playtimes.filmId INNER JOIN cinemas ON cinemas.id = films.CinemaId WHERE playtimes.filmId= ? AND films.cinemaId= ?", [filmId, req.query.cinemaId])
    return res.json(rows)
  } catch (error) {
    return res.status(400).json({message: error.message})
  }
})



module.exports = {
  createPlayTime,
  getAllPlayTime,
  updatePlayTime,
  getDetailPlayTimeByCluster,
  detailPlaytime,
};
