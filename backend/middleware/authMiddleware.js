const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key_change_in_production";

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token not provided" });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && (req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Admin access required" });
  }
};

const isStaff = (req, res, next) => {
  if (req.user && (req.user.role === "staff" || req.user.role === "admin" || req.user.role === "superadmin")) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Staff access required" });
  }
};

const isSuperAdmin = (req, res, next) => {
  if (req.user && req.user.role === "superadmin") {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden: Super admin access required" });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden: Access denied" });
    }
    next();
  };
};

module.exports = authMiddleware;
module.exports.isAdmin = isAdmin;
module.exports.isStaff = isStaff;
module.exports.isSuperAdmin = isSuperAdmin;
module.exports.authorize = authorize;