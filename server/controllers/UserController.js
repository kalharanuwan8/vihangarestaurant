// backend/controllers/userController.js
import User from '../model/User.js';

export const createUser = async (req, res) => {
  try {
    const { email, password, isAdmin } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const user = new User({
      email,
      password, // ⚠️ No hashing here as per your request
      isAdmin
    });

    await user.save();

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: user._id,
        email: user.email,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: 'Server error while creating user' });
  }
};
