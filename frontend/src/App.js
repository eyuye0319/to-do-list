import React from 'react';
import './App.css';
import TodoList from './components/TodoList'; // Check this path!

function App() {
  return (
    <div className="APP">
      <TodoList />
    </div>
  );
}


const form = document.getElementById('todo-form');
const input = document.getElementById('todo-input');
const list = document.getElementById('todo-list');

let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
render();

function render() {
  list.innerHTML = "";
  tasks.forEach((task, idx) => {
    const li = document.createElement('li');
    li.classList.toggle('completed', task.completed);

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.onclick = () => { tasks[idx].completed = !tasks[idx].completed; update(); };

    // Label editable inline
    const label = document.createElement('span');
    label.textContent = task.text;
    label.contentEditable = true;
    label.onblur = () => { tasks[idx].text = label.textContent; update(); };
    label.onkeydown = (e) => { if (e.key === "Enter") label.blur(); };

    // Delete button
    const del = document.createElement('button');
    del.textContent = "x";
    del.onclick = () => { tasks.splice(idx,1); update(); };

    li.append(checkbox, label, del);
    list.append(li);
  });
}

function update() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  render();
}

form.onsubmit = (e) => {
  e.preventDefault();
  const text = input.value.trim();
  if (text) {
    tasks.push({ text, completed: false });
    update();
    input.value = '';
  }
};

export default App;