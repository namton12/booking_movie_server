const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");
// const Cluster = require("./cluster.model");
// const Film = require("./film.model");

class Book extends Model {
  id;
  userId;
  playTimeId;
  seatIndex;
  txId;
  idFilm;
  id_room;
  id_book;
  time_created
}

Book.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    dateStart: {
      type: DataTypes.DATE,
    },
    playTimeId: {
      type: DataTypes.INTEGER,
      references: {
        model: "playtimes",
        key: "id",
      },
    },
    txId: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
      references: {
        model: "Users",
        key: "id",
      },
    },
    seatIndex: {
      type: DataTypes.INTEGER,
    },
    img: {
      type: DataTypes.STRING,
    },
    idFilm: {
      type: DataTypes.INTEGER,
      references: {
        model: "Film",
        key: "id",
      },
    },
    id_room: {
      type: DataTypes.INTEGER
    },
    id_book: {
      type: DataTypes.STRING
    },
    time_created: {
      type: DataTypes.STRING
    }
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = Book;
