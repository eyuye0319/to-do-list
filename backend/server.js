const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // This allows the Frontend to talk to the Backend
app.use(express.json()); // This allows the server to read the tasks you send

// Temporary Data Storage
let tasks = [
  { id: 1, text: "Welcome to your To-Do App!", completed: false }
];

// Route: Get all tasks
app.get('/api/tasks', (req, res) => {
  res.json(tasks);
});

// Route: Add a new task
app.post('/api/tasks', (req, res) => {
  const newTask = {
    id: Date.now(),
    text: req.body.text,
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Route: Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  const { id } = req.params;
  tasks = tasks.filter(task => task.id !== parseInt(id));
  res.json({ message: "Task deleted" });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});