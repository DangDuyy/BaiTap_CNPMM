import 'dotenv/config';
import jwt from 'jsonwebtoken';
import User from '../models/users.js';

export const auth = (req, res, next) => {
  // Định nghĩa white list không cần auth
  const white_lists = ["/v1/api/", "/v1/api/register", "/v1/api/login"];
  
  // Kiểm tra nếu path hiện tại nằm trong white list
  if(white_lists.includes(req.originalUrl)){
    return next();
  }

  // Kiểm tra token
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: "Bạn chưa truyền access token"
    });
  }

  const token = authHeader.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      name: decoded.name,
      createdBy: 'hoidatit'
    }
    next();
  } catch(error) {
    return res.status(401).json({
      message: "Token bị hết hạn hoặc không hợp lệ"
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1]; // Bearer token
    
    if (token) {
      // Nếu có token, verify và lấy user info
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (user) {
        req.user = { id: user._id, email: user.email, name: user.name };
      }
    }
    
    // Tiếp tục xử lý dù có token hay không
    next();
  } catch (error) {
    // Nếu token không hợp lệ, vẫn tiếp tục (không throw error)
    console.log("Invalid token, but continuing...");
    next();
  }
};