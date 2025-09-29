const mongoose = require('mongoose');
const User = require('../models/user');      // Đường dẫn tới model User
const Product = require('../models/product'); // Đường dẫn tới model Product

mongoose.connect('mongodb://localhost:27017/ten_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const users = [
  { name: 'Nguyen Van A', email: 'a@gmail.com', password: '123456' },
  { name: 'Tran Thi B', email: 'b@gmail.com', password: '123456' },
];

const products = [
  { name: 'Iphone 15', category: 'Điện thoại', price: 20000000, promotion: 10 },
  { name: 'Macbook Pro', category: 'Laptop', price: 35000000, promotion: 5 },
  { name: 'Samsung S24', category: 'Điện thoại', price: 18000000, promotion: 15 },
];

async function seed() {
  try {
    await User.deleteMany({});
    await Product.deleteMany({});
    await User.insertMany(users);
    await Product.insertMany(products);
    console.log('Seed dữ liệu thành công!');
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
  }
}

seed();