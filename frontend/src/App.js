import React, { useEffect, useState } from 'react';
import './App.css';
import TodoList from './components/TodoList';

function App() {
  const [tasks, setTasks] = useState([]);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('tasks')) || [];
    setTasks(saved);
  }, []);

  // Save to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  return (
    <div className="APP">
      <TodoList tasks={tasks} setTasks={setTasks} />
    </div>
  );
}

export default App;