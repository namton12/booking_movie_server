const { Model, DataTypes } = require("sequelize");
const { sequelize } = require("../connect/sequelize");

class User extends Model {
  id;
  username;
  password;
  email;
  phoneNumber;
  date;
  address;
  role;
  walletAddress;
  privateKey;
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    phoneNumber: {
      type: DataTypes.STRING,
    },
    address: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    date: {
      type: DataTypes.DATE,
    },
    walletAddress: {
      type: DataTypes.STRING,
    },
    privateKey: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    timestamps: true,
  }
);

module.exports = User;
