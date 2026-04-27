const express = require("express");
const app = express();

app.use(express.json());

// fake database (array)
let todos = [];

// GET all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// POST new todo
app.post("/api/todos", (req, res) => {
  const newTodo = req.body;
  todos.push(newTodo);
  res.json({ message: "Todo added", data: newTodo });
});

// DELETE todo
app.delete("/api/todos/:index", (req, res) => {
  const index = req.params.index;
  todos.splice(index, 1);
  res.json({ message: "Todo deleted" });
});

// start server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});