import { useState } from "react";

export default function TaskInput({ addTask }) {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(value);
    setValue("");
  };

  return (
    <form onSubmit={handleSubmit} className="task-input">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Add new task..."
      />
      <button>Add</button>
    </form>
  );
}