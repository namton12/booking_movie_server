const expressAsyncHandler = require("express-async-handler");
const connection = require("../db/init");
const Cinema = require("../models/Cinema.model");
const Cluster = require("../models/cluster.model");
const Film = require("../models/film.model");
const PlayTime = require("../models/PlayTime.model");

const createCluster = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Cluster.create(req.body);
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const getAllCluster = expressAsyncHandler(async (req, res) => {
  try {
    const data = await Cluster.findAll({
      include: [{ model: Cinema, include: [{model: Film, include: PlayTime}]}],
    });
    return res.json(data);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const deleteCluster = expressAsyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const num = await Cluster.destroy({ where: { id } });
    return res.json(num);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});
const updateCluster = expressAsyncHandler(async (req, res) => {
  try {
    const cluster = await Cluster.update(
      { ...req.body },
      { where: { id: req.params.id } }
    );

    return res.json(cluster);
  } catch (error) {
    return res.status(404).json(error.message);
  }
});

const detailCluster= expressAsyncHandler(async(req, res)=> {
  try {
    const {id}= req.params
    const [cluster]= await connection.execute("SELECT ClusterName, id, address, img FROM clusters WHERE id= ?", [id])
    return res.status(200).json(cluster[0])
  } catch (error) {
    return res.status(404).json(error.message);
    
  }
})

module.exports = {
  createCluster,
  deleteCluster,
  getAllCluster,
  updateCluster,
  detailCluster
};
