const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");
const Film = require("./film.model");

class Comment extends Model {
  id;
  userId;
  content;
  filmId;
  rate
}

Comment.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    content: {
      type: DataTypes.STRING,
    },
    userId: {
      type: DataTypes.INTEGER,
    },
    filmId: {
      type: DataTypes.INTEGER,
    },
    rate: {
      type: DataTypes.INTEGER
    }
  },
  {
    sequelize,
    timestamps: true,
    hooks: {
      beforeCreate: async (commnet) => {
        if (!(await Film.findByPk(commnet.getDataValue("filmId"))))
          throw new Error("not found Film");
      },
    },
  }
);

module.exports = Comment;
