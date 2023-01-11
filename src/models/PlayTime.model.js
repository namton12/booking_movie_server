const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");
// const Cluster = require("./cluster.model");
// const Film = require("./film.model");

class PlayTime extends Model {
  id;
  timeStart;
  filmId;
  roomId;
  // cinemaId;
}

PlayTime.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    timeStart: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filmId: {
      type: DataTypes.INTEGER,
      references: {
        model: "films",
        key: "id",
      },
      allowNull: false,
    },
    roomId: {
      type: DataTypes.INTEGER, 
      references: {
        model: "rooms",
        key: "id",
      },
      allowNull: false,
    }
    // cinemaId: {
    //   type: DataTypes.INTEGER,
    //   references: {
    //     model: "cinemas",
    //     key: "id",
    //   },
    //   allowNull: true,
    // },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = PlayTime;
