const express = require('express');
const { createUser, getUsers, getUserById } = require('../controller/User.controller/userIntegration.Controller');
const router = express.Router();

router.post('/users', createUser);
router.get('/users', getUsers);
router.get('/users/:id', getUserById); // ✅ FIXED: Added getUserById

module.exports = router;
