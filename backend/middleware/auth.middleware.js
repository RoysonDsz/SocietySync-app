import 'dotenv/config';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).send({ error: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send({ error: 'Invalid token.' });
  }
};

export default authMiddleware;