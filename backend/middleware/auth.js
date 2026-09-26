const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    const extractedToken = token.replace('Bearer ', '');
    const decoded = jwt.verify(extractedToken, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

function adminAuth(req, res, next) {
    auth(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Admin resource. Access denied.' });
        }
        next();
    });
}

module.exports = { auth, adminAuth };
