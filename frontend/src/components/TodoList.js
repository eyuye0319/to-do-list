import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTasks(data);
      })
      .catch(() => {
        setTasks([{ _id: "1", text: "Sample Task", completed: false }]);
      });
  }, []);

  const addTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputValue, completed: false }),
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  const toggleComplete = async (id, status) => {
    const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !status }),
    });

    const updated = await res.json();
    setTasks(tasks.map(t => t._id === id ? updated : t));
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, {
      method: 'DELETE',
    });

    setTasks(tasks.filter(t => t._id !== id));
  };

  const filtered = tasks.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const total = tasks.length;
  const done = tasks.filter(t => t.completed).length;

  return (
    <div className="app">

      <aside className="sidebar">
        <h2 className="logo">TaskFlow</h2>

        <div className="user">
          <div className="avatar">W</div>
          <p>Wubgzer</p>
        </div>

        <nav className="menu">
          <button onClick={() => setFilter('all')}>📋 All Tasks</button>
          <button onClick={() => setFilter('active')}>⏳ Active</button>
          <button onClick={() => setFilter('completed')}>✅ Completed</button>
        </nav>

        <div className="stats">
          <p>Total: {total}</p>
          <p>Done: {done}</p>
        </div>
      </aside>

      <main className="main">

        <div className="header">
          <h1>My Tasks</h1>
          <span>{new Date().toDateString()}</span>
        </div>

        <form onSubmit={addTask} className="add">
          <input
            type="text"
            placeholder="Add new task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button>Add</button>
        </form>

        {filtered.length === 0 ? (
          <p className="empty">No tasks here</p>
        ) : (
          <ul className="list">
            {filtered.map(task => (
              <li key={task._id} className={task.completed ? "done" : ""}>
                <input
                  type="checkbox"
                  checked={task.completed || false}
                  onChange={() => toggleComplete(task._id, task.completed)}
                />
                <span>{task.text}</span>
                <button onClick={() => deleteTask(task._id)}>✕</button>
              </li>
            ))}
          </ul>
        )}

      </main>
    </div>
  );
}

export default TodoList;