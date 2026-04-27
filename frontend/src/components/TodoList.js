import React, { useState, useEffect } from 'react';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // 1. Load tasks from the server when the page opens
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => setTasks(data))
      .catch(err => console.error("Server connection failed"));
  }, []);

  // 2. Add a task
  const addTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: inputValue }),
    });

    const newTask = await response.json();
    setTasks([...tasks, newTask]);
    setInputValue('');
  };

  // 3. Delete a task
  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: 'DELETE' });
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <div className="todo-container">
      <h2>My Tasks</h2>
      <form onSubmit={addTask} className="todo-form">
        <input 
          type="text" 
          value={inputValue} 
          onChange={(e) => setInputValue(e.target.value)} 
          placeholder="Add a new task..."
        />
        <button type="submit">Add</button>
      </form>

      <ul className="todo-list">
        {tasks.map(task => (
          <li key={task.id}>
            <span>{task.text}</span>
            <button className="delete-btn" onClick={() => deleteTask(task.id)}>×</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;