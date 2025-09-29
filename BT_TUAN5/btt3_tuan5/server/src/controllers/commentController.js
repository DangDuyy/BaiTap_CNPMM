import CommentProduct from "../models/commentProduct.js";
import Product from "../models/product.js";
export const addComment = async (req, res) => {
  try {
    const { productId, content, rating } = req.body;
    const userId = req.user.id;
    if (!content) {
      return res.status(400).json({
        success: false,
        message: "Nội dung bình luận không được trống",
      });
    }
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        success: false,
        message: "Đánh giá phải từ 1-5 sao",
      });
    }
    const comment = new CommentProduct({
      user: userId,
      product: productId,
      content,
      rating,
    });
    await comment.save();

    await Product.findByIdAndUpdate(productId, { $inc: { commentCount: 1 } });

    const populatedComment = await CommentProduct.findById(comment._id).populate(
      "user",
      "name email"
    );
    res.status(201).json({
      success: true,
      message: "Đã thêm bình luận",
      data: populatedComment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const comments = await CommentProduct.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await CommentProduct.countDocuments({ product: productId });

    res.status(200).json({
      success: true,
      data: comments,
      pagination: {
        current: page,
        limit,
        total,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user.id;

    const comment = await CommentProduct.findById(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy bình luận'
      });
    }

    // Kiểm tra người xóa có phải người comment không
    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Bạn không có quyền xóa bình luận này'
      });
    }

    await comment.deleteOne();

    // Giảm số lượng comment của sản phẩm
    await Product.findByIdAndUpdate(
      comment.product,
      { $inc: { commentCount: -1 } }
    );

    res.status(200).json({
      success: true,
      message: 'Đã xóa bình luận'
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
