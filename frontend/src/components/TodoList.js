import React, { useState, useEffect } from "react";
import "./TodoList.css";

import Logo from "./Logo";
import Header from "./Header";
import Stats from "./Stats";
import FilterBar from "./FilterBar";
import TaskInput from "./TaskInput";
import TaskItem from "./TaskItem";

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const API = "http://localhost:5000/api/tasks";

  useEffect(() => {
    fetch(API)
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch(() => {
        const local = JSON.parse(localStorage.getItem("tasks")) || [];
        setTasks(local);
      });
  }, []);

  // ADD TASK
  const addTask = (text) => {
    if (!text.trim()) return;

    const newTask = { _id: Date.now(), text, completed: false };
    const updated = [...tasks, newTask];

    setTasks(updated);
    localStorage.setItem("tasks", JSON.stringify(updated));
  };

  // TOGGLE
  const toggle = (id) => {
    const updated = tasks.map((t) =>
      t._id === id ? { ...t, completed: !t.completed } : t
    );

    setTasks(updated);
  };

  // DELETE
  const remove = (id) => {
    const updated = tasks.filter((t) => t._id !== id);
    setTasks(updated);
  };

  // CLEAR COMPLETED
  const clearCompleted = () => {
    setTasks(tasks.filter((t) => !t.completed));
  };

  // FILTER + SEARCH
  const filtered = tasks
    .filter((t) => {
      if (filter === "active") return !t.completed;
      if (filter === "completed") return t.completed;
      return true;
    })
    .filter((t) => t.text.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className={darkMode ? "app dark" : "app"}>

      {/* SIDEBAR */}
      <aside className="sidebar">

        <Logo />

        <button onClick={() => setDarkMode(!darkMode)}>
          🌙 Toggle Theme
        </button>

        <FilterBar setFilter={setFilter} />

        <Stats
          total={tasks.length}
          done={tasks.filter((t) => t.completed).length}
        />

        <button onClick={clearCompleted}>🧹 Clear Completed</button>
      </aside>

      {/* MAIN */}
      <main className="main">

        <Header />

        <input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <TaskInput addTask={addTask} />

        <ul>
          {filtered.map((task) => (
            <TaskItem
              key={task._id}
              task={task}
              toggle={toggle}
              remove={remove}
            />
          ))}
        </ul>

      </main>
    </div>
  );
}

export default TodoList;