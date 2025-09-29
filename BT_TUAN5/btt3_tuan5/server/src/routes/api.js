import express from 'express';
import {
  createUser,
  handleLogin,
  getUser,
  getAccount,
} from '../controllers/userController.js';
import {auth,optionalAuth} from '../middleware/auth.js';
import delay from '../middleware/delay.js';
import * as productController from '../controllers/productController.js';
import * as favoriteController from '../controllers/favoriteController.js';
import * as commentController from '../controllers/commentController.js';

const routerAPI = express.Router();
//routerAPI.all("*", auth);
routerAPI.get("/", (req, res) => {
  return res.status(200).json("Hello world api");
});
routerAPI.post("/register", createUser);
routerAPI.post("/login", handleLogin);
routerAPI.get("/products", auth, productController.getAllProducts); // Fixed method name
routerAPI.post("/products/create", auth, productController.createProduct);
routerAPI.get('/products/:productId',optionalAuth, productController.getProductDetail);
routerAPI.get('/products/:productId/similar', productController.getSimilarProducts);

// Favorite routes (cần xác thực)
routerAPI.post('/favorites', auth, favoriteController.addFavorite);
routerAPI.delete('/favorites/:productId', auth, favoriteController.removeFavorite);
routerAPI.get('/favorites', auth, favoriteController.getFavorites);

// Recently viewed routes (cần xác thực)
routerAPI.get('/recently-viewed', auth, productController.getRecentlyViewed);

// Route cần bảo vệ - thêm middleware auth
routerAPI.get("/user", auth, getUser);
routerAPI.get("/account", auth, delay, getAccount);

routerAPI.post('/comments', auth, commentController.addComment);
routerAPI.get('/products/:productId/comments', commentController.getProductComments);
routerAPI.delete('/comments/:commentId', auth, commentController.deleteComment);
export default routerAPI;