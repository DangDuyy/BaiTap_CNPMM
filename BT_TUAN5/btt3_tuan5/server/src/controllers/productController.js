// controllers/product.js
import { getProducts } from "../services/product.js";
import Product from '../models/product.js';
import RecentlyViewed from '../models/recentlyViewedProduct.js';
import Comment from '../models/commentProduct.js';
import Order from '../models/order.js';
import { get } from "mongoose";

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;

    const filters = {
      category: req.query.category || null,
      search: req.query.search || null,
      priceMin: req.query.priceMin || null,   // ✅ đổi tên cho khớp
      priceMax: req.query.priceMax || null,   // ✅ đổi tên cho khớp
      promotion: req.query.promotion || null,
      sortBy: req.query.sortBy || null,
    };

    const { products, total } = await getProducts(page, limit, filters);

    return res.status(200).json({ data: products, total });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server" });
  }
};

export const getProductDetail = async (req, res) => {
  try {
    const { productId } = req.params;
    // Lấy userId từ middleware optionalAuth
    const userId = req.user?.id;

    // Kiểm tra sản phẩm tồn tại
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Không tìm thấy sản phẩm' 
      });
    }

    // Tăng lượt xem
    product.viewCount += 1;
    await product.save();

    // Lấy số người mua và bình luận
    const purchaseCount = await Order.countDocuments({
      'products.product': productId
    });
    
    const commentCount = await Comment.countDocuments({ 
      product: productId 
    });

    // Cập nhật recently viewed nếu có userId
    if (userId) {
      try {
        await RecentlyViewed.findOneAndUpdate(
          { 
            user: userId, 
            product: productId 
          },
          { 
            viewedAt: Date.now(),
            user: userId,
            product: productId
          },
          { 
            upsert: true, 
            new: true,
            setDefaultsOnInsert: true
          }
        );
        console.log(`Updated recently viewed for user ${userId} and product ${productId}`);
      } catch (recentError) {
        console.error('Error updating recently viewed:', recentError);
      }
    }

    // Trả về thông tin sản phẩm
    res.status(200).json({
      success: true,
      data: {
        ...product.toObject(),
        purchaseCount,
        commentCount
      }
    });

  } catch (error) {
    console.error('Error in getProductDetail:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Lấy sản phẩm tương tự
export const getSimilarProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Lấy thông tin sản phẩm hiện tại
    const currentProduct = await Product.findById(productId);
    if (!currentProduct) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }
    
    // Tìm sản phẩm cùng danh mục, ngoại trừ sản phẩm hiện tại
    const similarProducts = await Product.find({
      _id: { $ne: productId },
      category: currentProduct.category
    }).limit(4);
    
    res.status(200).json({ success: true, data: similarProducts });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Lấy sản phẩm đã xem gần đây
export const getRecentlyViewed = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const recentlyViewed = await RecentlyViewed.find({ user: userId })
      .sort({ viewedAt: -1 })
      .limit(10)
      .populate('product');
    
    const products = recentlyViewed.map(item => item.product);
    
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      category,
      price,
      promotion = 0,
      description,
      images = []
    } = req.body;

    // Validate required fields
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Tên, danh mục và giá sản phẩm là bắt buộc'
      });
    }

    // Validate price
    if (price <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Giá sản phẩm phải lớn hơn 0'
      });
    }

    // Validate promotion
    if (promotion < 0 || promotion > 100) {
      return res.status(400).json({
        success: false,
        message: 'Khuyến mãi phải từ 0 đến 100%'
      });
    }

    // Tạo sản phẩm mới
    const newProduct = new Product({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      promotion: Number(promotion),
      description: description ? description.trim() : '',
      images: images,
      viewCount: 0,
      purchaseCount: 0,
      commentCount: 0
    });

    // Lưu vào database
    const savedProduct = await newProduct.save();

    res.status(201).json({
      success: true,
      message: 'Tạo sản phẩm thành công',
      data: savedProduct
    });

  } catch (error) {
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errorMessages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: 'Dữ liệu không hợp lệ',
        errors: errorMessages
      });
    }

    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo sản phẩm'
    });
  }
};