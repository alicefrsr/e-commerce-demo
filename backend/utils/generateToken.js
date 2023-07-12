import jwt from 'jsonwebtoken';
const generateToken = (res, userId) => {
  // (userId is user._id passed in in controller loginUser method)
  // define the token
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '30d' });

  // set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in ms
  });
};

export default generateToken;
