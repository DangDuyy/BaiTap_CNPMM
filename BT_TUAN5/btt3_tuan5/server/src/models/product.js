import mongoose from 'mongoose';

// Kiểm tra xem model đã được định nghĩa chưa
const Product = mongoose.models.Product || mongoose.model('Product', new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  promotion: { type: Number, default: 0 },
  description: { type: String },
  images: [String],
  // Thêm các trường mới
  viewCount: { type: Number, default: 0 },
  purchaseCount: { type: Number, default: 0 },
  commentCount: { type: Number, default: 0 }
}, { timestamps: true }));

export default Product;