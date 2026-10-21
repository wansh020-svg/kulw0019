import User from '../models/User.js';

// GET /api/users
const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    // Simulated network delay so the frontend loading state is visible
    setTimeout(() => res.status(200).json(users), 2000);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// GET /api/users/:id
const getUserById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: 'User ID must be a number' });
    }

    // findOne returns null (not an error) when nothing matches
    const user = await User.findOne({ userId: id });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

export { getUsers, getUserById };
