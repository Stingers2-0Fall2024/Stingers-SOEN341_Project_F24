const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Userstructure');

// Validates if the email belongs to Concordia ( live.concordia.ca or concordia.ca)
const isConcordiaEmail = (email) => /@(?:live\.)?concordia\.ca$/i.test(email);

// Registers the user (hash password so that it doesnt get compromised, creates user in database)
const registerUser=async (email, password, role = 'student') => {
  if (!isConcordiaEmail(email)){
    throw new Error("Not concordia student")
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user=await User.create({
    email,
    password:hashedPassword,
    role,
  });
  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token, role: user.role };
};

// Checks if the password added matches the password in the database, then creates a token so that he can be authorized to continue
const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new Error('User not found');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Invalid credentials');
  }

  const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
  return { token, role: user.role };
};

module.exports = {
  isConcordiaEmail,
  registerUser,
  loginUser,
};
