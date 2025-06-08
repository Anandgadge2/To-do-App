const express = require('express');
const jwt = require('jsonwebtoken');
const Task = require('../models/Task');
const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

function authMiddleware(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.sendStatus(403);
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(403);
  }
}

// Get tasks
router.get('/', authMiddleware, async (req, res) => {
  const tasks = await Task.find({ userId: req.user.id });
  res.json(tasks);
});

// Add task
router.post('/', authMiddleware, async (req, res) => {
  const task = new Task({ userId: req.user.id, text: req.body.text });
  await task.save();
  res.status(201).json(task);
});

// Delete task
router.delete('/:id', authMiddleware, async (req, res) => {
  await Task.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
  res.sendStatus(204);
});

module.exports = router;
