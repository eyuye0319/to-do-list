import React, { useState, useEffect } from 'react';
import './TodoList.css';

function TodoList() {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // 1. FETCH TASKS - Now includes error handling
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
        console.error("Backend Connection failed. Is node.js running? 🚀", err);
        // Fallback for styling testing
        setTasks([{ _id: "1", text: "Test Task", completed: false }]);
      });
  }, []);

  // 2. ADD TASK - Sends to backend
  const addTask = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    try {
      const response = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: inputValue, completed: false }), // Ensure initial state is synced
      });
      if (!response.ok) throw new Error("Server rejected add request");
      const newTask = await response.json();
      setTasks([...tasks, newTask]);
      setInputValue('');
    } catch (err) {
      console.error("Add task failed:", err);
    }
  };

  // 3. TOGGLE COMPLETE - This MUST send a PATCH/PUT to backend so it saves
  const toggleComplete = async (id, currentStatus) => {
    // Pessimistic update: wait for backend confirmation
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'PATCH', // Assuming your backend supports PATCH or PUT
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !currentStatus }),
      });
      if (!response.ok) throw new Error("Server rejected status update");
      const updatedTaskFromBackend = await response.json();
      
      setTasks(tasks.map(task => 
        task._id === id ? updatedTaskFromBackend : task
      ));
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  return (
    <div className="todo-dashboard">
      {/* SIDEBAR */}
      <aside className="todo-sidebar">
        <div className="sidebar-header">
          {/* UPDATED LOGO */}
          <div className="avatar-circle">W</div>
          {/* UPDATED NAME */}
          <div className="avatar-name">Wubgzer <span className="chevron-down">v</span></div>
          <div className="header-icons">
            <span className="icon">🔔</span>
            <span className="icon">|||</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li><span>🔍</span> Search</li>
            <li><span>📥</span> Inbox</li>
            <li className="active"><span>📅</span> Today</li>
            <li><span>🗓️</span> Upcoming</li>
            <li><span>🏷️</span> Filters & Labels</li>
          </ul>
        </nav>

        <div className="sidebar-projects">
          <div className="projects-header">
            <h3>My Projects</h3>
            <span className="plus-icon">+</span>
          </div>
          <ul className="project-list">
            <li><span className="project-dot fitness"></span> Fitness</li>
            <li><span className="project-dot website"></span> Website Update</li>
            <li><span className="project-dot grocery"></span> Groceries</li>
            <li><span className="project-dot appointment"></span> Appointments</li>
          </ul>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="todo-main">
        <div className="main-header">
          <h1>Today</h1>
          <div className="header-actions">
            <span className="view-action">⚙️ View</span>
          </div>
        </div>

        <div className="tasks-container">
          <ul className="clean-task-list">
            {tasks.map(task => (
              <li key={task._id} className={task.completed ? "task-complete" : ""}>
                <div className="task-content">
                  <input 
                    type="checkbox" 
                    checked={task.completed || false} 
                    // Pass current status so toggleComplete knows what to flip
                    onChange={() => toggleComplete(task._id, task.completed)} 
                  />
                  <div className="task-text-group">
                    <span className="task-main-text">{task.text}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="inline-add-task">
            <form onSubmit={addTask}>
              <span className="add-icon">+</span>
              <input 
                type="text" 
                placeholder="Add task" 
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default TodoList;
      