  // backend/controllers/authController.js
  import User from '../model/User.js';

  export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user || user.password !== password) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      res.status(200).json({
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ message: 'Server error during login' });
    }
  };
  // Get all users
  export const getAllUsers = async (req, res) => {
    try {
      const users = await User.find({}, '-password'); // Exclude password field
      res.status(200).json(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      res.status(500).json({ message: 'Failed to fetch users' });
    }
  };

  // Delete user by ID
  export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({ message: 'User deleted successfully', user: deletedUser });
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).json({ message: 'Failed to delete user' });
    }
  };

  // Change password
  export const changePassword = async (req, res) => {
    const { email, oldPassword, newPassword } = req.body;

    try {
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.password !== oldPassword) {
        return res.status(401).json({ message: 'Old password is incorrect' });
      }

      user.password = newPassword;
      await user.save();

      res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
      console.error('Error changing password:', err);
      res.status(500).json({ message: 'Failed to change password' });
    }
  };
