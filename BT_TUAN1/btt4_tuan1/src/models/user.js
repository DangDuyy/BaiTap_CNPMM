"use strict";
import { Model } from "sequelize";

export default (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // định nghĩa mối quan hệ
    }
  }

  User.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    address: DataTypes.STRING,
    phoneNumber: DataTypes.STRING,
    gender: DataTypes.BOOLEAN,
    image: DataTypes.STRING,
    roleId: DataTypes.STRING,
    positionId: DataTypes.STRING
  }, {
    sequelize,
    modelName: "User",
  });

  return User;
};
