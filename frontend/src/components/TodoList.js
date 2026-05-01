
      import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // FETCH TASKS
  useEffect(() => {
    fetch('http://localhost:5000/api/tasks')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error("Backend didn't send an array of tasks.");
        }
      })
      .catch(err => {
        console.error("Backend Connection failed:", err);
        // fallback
        setTasks([{ _id: "1", text: "Test Task", completed: false }]);
      });
  }, []);

  // ADD TASK
  const addTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, completed: false }),
      });

      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setInputValue('');
    } catch (err) {
      console.error("Add task failed:", err);
    }
  };

  // TOGGLE COMPLETE
  const toggleComplete = async (id, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });

      const updatedTask = await response.json();

      setTasks(tasks.map(task =>
        task._id === id ? updatedTask : task
      ));
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  // DELETE TASK
  const deleteTask = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });

      setTasks(tasks.filter(task => task._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // COUNTERS
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;

  return (
    <div className="todo-dashboard">

      {/* SIDEBAR */}
      <aside className="todo-sidebar">
        <div className="sidebar-header">
          <div className="avatar-circle">W</div>
          <div className="avatar-name">
            Wubgzer <span className="chevron-down">v</span>
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <main className="todo-main">
        <h1>Today</h1>

        {/* COUNTER */}
        <p>Total Tasks: {totalTasks}</p>
        <p>Completed: {completedTasks}</p>

        {/* TASK LIST */}
        <ul className="clean-task-list">
          {tasks.map(task => (
            <li key={task._id} className={task.completed ? "task-complete" : ""}>
              
              <input
                type="checkbox"
                checked={task.completed || false}
                onChange={() => toggleComplete(task._id, task.completed)}
              />

              <span>{task.text}</span>

              {/* DELETE BUTTON */}
              <button onClick={() => deleteTask(task._id)}>❌</button>
            </li>
          ))}
        </ul>

        {/* ADD TASK */}
        <form onSubmit={addTask}>
          <input
            type="text"
            placeholder="Add task..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </form>

      </main>
    </div>
  );
}

export default TodoList;