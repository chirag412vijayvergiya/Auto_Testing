const User = require('../models/User');
const mongoose = require('mongoose');

// exports.createUser = async (req, res) => {
//     try {
//         const { name, email } = req.body;
//         const newUser = await User.create({ name, email });
//         res.status(201).json(newUser);
//     } catch (error) {
//         if (error.code === 11000) { // Handle duplicate email
//             return res.status(400).json({ error: 'Email already exists' });
//         }
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

exports.createUser = async (req, res) => {
    try {
        const { name, email } = req.body;

        // if (!name || !email) {
        //     return res.status(400).json({ error: "Name and email are required" });
        // }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email already exists" });
        }

        const newUser = await User.create({ name, email });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.getUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// ✅ FIX: Add GET /api/users/:id
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params;

        // Handle invalid ObjectId format
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid user ID format' });
        }

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
