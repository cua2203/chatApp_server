const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // Lấy token từ cookie 'jwt'
    const token = req.cookies.jwt_token;
    console.log('middleware', token);
 
  
    // Nếu không có token, trả về lỗi 401 (Unauthorized)
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }
  
    // Kiểm tra token hợp lệ
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid or expired token' }); // Trả về lỗi 403 (Forbidden) nếu token không hợp lệ
      }
  
      // Lưu thông tin người dùng từ token vào request để sử dụng sau này
      req.user = user;
      next();
    });
  }
  
  module.exports = authenticateToken;