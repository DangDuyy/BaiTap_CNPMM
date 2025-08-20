// services/CRUDService.js  (ESM)
import bcrypt from 'bcryptjs';
import db from '../models/index.js'; // ../models/index.js của Sequelize xuất ra db
const salt = bcrypt.genSaltSync(10);

/** Hash password (sync) */
function hashUserPassword(password) {
  return bcrypt.hashSync(password, salt);
}

/** CREATE */
async function createNewUser(data) {
  const hashed = hashUserPassword(data.password);
  await db.User.create({
    email: data.email,
    password: hashed,
    firstName: data.firstName,
    lastName: data.lastName,
    address: data.address,
    phoneNumber: data.phoneNumber,
    gender: data.gender === '1', // '1' -> true, khác -> false
    roleId: data.roleId,
  });
  return 'OK create a new user successfull';
}

/** READ ONE */
async function getUserInfoById(userId) {
  const user = await db.User.findOne({
    where: { id: userId }
  });
  return user ?? null;
}

/** READ ALL */
async function getAllUser() {
  return await db.User.findAll({ raw: true });
}

/** UPDATE */
async function updateUser(data) {
  console.log('Dữ liệu nhận được khi cập nhật:', data);
  const user = await db.User.findOne({ where: { id: Number(data.id) } });
  if (!user) return null;

  user.email = data.email;
  user.firstName = data.firstName;
  user.lastName = data.lastName;
  user.address = data.address;
  user.phoneNumber = data.phoneNumber;
  user.gender = data.gender === '1' || data.gender === 1;
  user.roleId = data.roleId;
  user.image = data.image || user.image;
  user.positionId = data.positionId || user.positionId;
  await user.save();

  // Trả về true nếu thành công
  return true;
}

/** DELETE */
async function deleteUserById(userId) {
  // trả về số bản ghi đã xóa (0 hoặc 1)
  return await db.User.destroy({ where: { id: userId } });
}

export default {
  hashUserPassword,
  createNewUser,
  getUserInfoById,
  getAllUser,
  updateUser,
  deleteUserById,
};
