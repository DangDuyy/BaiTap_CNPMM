import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
  description: { type: String, default: null },
  category: { type: String, required: true, index: true },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, default: null },
  image: { type: String, default: null },
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  inStock: { type: Boolean, default: true },
  tags: [{ type: String }],
  views: { type: Number, default: 0 },
  isOnSale: { type: Boolean, default: false },
  discount: { type: Number, default: 0 },
  _destroy: { type: Boolean, default: false }
}, { timestamps: true })

productSchema.index({ name: 'text', description: 'text', tags: 'text', category: 'text' })

const productModel = mongoose.model('Product', productSchema)
export default productModel
