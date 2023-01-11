const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");
const Banner = require("./banner.model");
const Cinema = require("./Cinema.model");

class Film extends Model {
  id;
  movieName;
  desc;
  actor;
  price;
  img;
  dateStart;
  dateEnd;
  country;
  flimStudio;
  version;
  genre;
  CinemaId;
  state;
  limitAge;
  trailer;
  director;
  txId;
  contractAddress;
}

Film.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    movieName: {
      type: DataTypes.STRING,
    },
    desc: {
      type: DataTypes.STRING,
    },
    actor: {
      type: DataTypes.STRING,
    },
    price: {
      type: DataTypes.STRING,
    },
    img: {
      type: DataTypes.STRING,
    },

    dateStart: {
      type: DataTypes.STRING,
    },
    dateEnd: {
      type: DataTypes.STRING,
    },

    country: {
      type: DataTypes.STRING,
    },
    flimStudio: {
      type: DataTypes.STRING,
    },
    version: {
      type: DataTypes.STRING,
    },
    genre: {
      type: DataTypes.STRING,
    },
    limitAge: {
      type: DataTypes.INTEGER,
    },
    trailer: {
      type: DataTypes.STRING
    },
    CinemaId: {
      type: DataTypes.INTEGER,
      references: {
        model: "cinemas",
        key: "id",
      },
    },
    state: {
      type: DataTypes.STRING,
    },
    director: {
      type: DataTypes.STRING
    },
    txId: {
      type: DataTypes.STRING
    },
    contractAddress: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Film;
