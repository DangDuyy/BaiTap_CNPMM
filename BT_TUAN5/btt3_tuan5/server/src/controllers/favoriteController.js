import Favorite from '../models/favoriteProduct.js';
import Product from '../models/product.js';

// Thêm sản phẩm vào danh sách yêu thích
export const addFavorite = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id; // Lấy từ middleware authentication

    const favorite = new Favorite({
      user: userId,
      product: productId
    });

    await favorite.save();
    res.status(201).json({ success: true, message: 'Đã thêm vào danh sách yêu thích' });
  } catch (error) {
    // Nếu lỗi do trùng lặp (đã yêu thích trước đó)
    if (error.code === 11000) {
      return res.status(400).json({ success: false, message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }
    res.status(500).json({ success: false, message: error.message });
  }
};

// Xóa sản phẩm khỏi danh sách yêu thích
export const removeFavorite = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user.id;

    await Favorite.findOneAndDelete({ user: userId, product: productId });
    res.status(200).json({ success: true, message: 'Đã xóa khỏi danh sách yêu thích' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy danh sách sản phẩm yêu thích của người dùng
export const getFavorites = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const favorites = await Favorite.find({ user: userId })
      .populate('product')
      .sort({ createdAt: -1 });
    
    const products = favorites.map(f => f.product);
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};