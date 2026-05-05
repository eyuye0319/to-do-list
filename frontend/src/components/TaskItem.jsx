export default function TaskItem({ task, toggle, remove }) {
  return (
    <li className={task.completed ? "done" : ""}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => toggle(task._id, task.completed)}
      />
      <span>{task.text}</span>

      <button onClick={() => remove(task._id)}>✕</button>
    </li>
  );
}