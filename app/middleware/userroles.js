const jwt = require('jsonwebtoken');
const User = require('../models/Userstructure');

// Checks if the user has the correct role and then proceeds
// If no token provided, blocks access
const roleCheck=(requiredRole)=>{
  return async (req, res, next)=>{
    const token=req.header('Authorization').replace('Bearer ', '');
    if (!token){
      return res.status(403).json({error: 'Access denied' });
    }
    // If user is not found, access is denied
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);
      
      if (!user || user.role !== requiredRole) {
        return res.status(403).json({ error: 'Access denied' });
      }
    // If user is found, it proceeds
      req.user = user;
      next();

    // Else it will show an error if it occurs
    } catch (err) {
      return res.status(403).json({ error: 'Error' });
    }
  };
};

module.exports = roleCheck;
