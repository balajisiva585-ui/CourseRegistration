import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_course_registration_system_2026'
      );

      const user = await User.findById(decoded.id)
        .select('-password')
        .populate('studentProfile')
        .populate('facultyProfile');

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'User no longer exists or token is invalid.',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, token invalid or expired.',
      });
    }
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, no token provided.',
    });
  }
};

export const optionalAuth = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'super_secret_jwt_key_course_registration_system_2026'
      );

      const user = await User.findById(decoded.id)
        .select('-password')
        .populate('studentProfile')
        .populate('facultyProfile');

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Ignore token error for optional auth
    }
  }
  next();
};

