const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");
const Cinema = require("./Cinema.model");
const Film = require("./film.model");

class DisCount extends Model {
  id;
  filmId;
  dateStart;
  dateEnd;
  img;
  percent;
}

DisCount.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dateStart: {
      type: DataTypes.STRING,
    },
    dateEnd: {
      type: DataTypes.STRING,
    },
    filmId: {
      type: DataTypes.INTEGER,
      references: {
        model: "films",
        key: "id",
      },
    },
    img: {
      type: DataTypes.STRING,
    },
    percent: {
      type: DataTypes.INTEGER,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = DisCount;
