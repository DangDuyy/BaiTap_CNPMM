import mongoose from 'mongoose';

const recentlyViewedSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

// Đảm bảo mỗi cặp user-product chỉ có một bản ghi (cập nhật thời gian xem gần nhất)
recentlyViewedSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model('RecentlyViewed', recentlyViewedSchema);