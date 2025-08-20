// controller/homeController.js  (ESM)
import db from '../models/index.js';
import CRUDService from '../services/CRUDService.js';

// Trang chủ: demo lấy user và render
async function getHomePage(req, res, next) {
  try {
    const data = await db.User.findAll({ raw: true });
    return res.render('homepage.ejs', { data: JSON.stringify(data) });
  } catch (err) { next(err); }
}

// Trang about
function getAboutPage(req, res) {
  return res.render('test/about.ejs');
}

// Form CRUD
function getCRUD(req, res) {
  return res.render('crud.ejs');
}

// List all users
async function getFindAllCrud(req, res, next) {
  try {
    const data = await CRUDService.getAllUser();
    return res.render('users/findAllUser.ejs', { datalist: data });
  } catch (err) { next(err); }
}

// Create user
async function postCRUD(req, res, next) {
  try {
    const msg = await CRUDService.createNewUser(req.body);
    console.log(msg);
    // sau khi tạo xong quay lại trang danh sách
    return res.redirect('/get-crud');
  } catch (err) { next(err); }
}

// Lấy data để edit
async function getEditCRUD(req, res, next) {
  try {
    const userId = req.query.id;
    if (!userId) return res.status(400).send('Missing id');

    const userData = await CRUDService.getUserInfoById(userId);
    if (!userData) return res.status(404).send('User not found');

    return res.render('users/editUser.ejs', { data: userData });
  } catch (err) { next(err); }
}

// Update user
async function putCRUD(req, res, next) {
  try {
    const allUsers = await CRUDService.updateUser(req.body);
    if (!allUsers) return res.status(404).send('User not found');

    return res.render('users/findAllUser.ejs', { datalist: allUsers });
  } catch (err) { next(err); }
}

// Delete user
async function deleteCRUD(req, res, next) {
  try {
    const id = req.query.id; // ?id=1
    if (!id) return res.status(400).send('Missing id');

    const rows = await CRUDService.deleteUserById(id);
    if (rows === 0) return res.status(404).send('Not find user');

    return res.redirect('/get-crud');
  } catch (err) { next(err); }
}

export default {
  getHomePage,
  getAboutPage,
  getCRUD,
  getFindAllCrud,
  postCRUD,
  getEditCRUD,
  putCRUD,
  deleteCRUD,
};
