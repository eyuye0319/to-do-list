export default function Stats({ total, done }) {
  return (
    <div className="stats-box">
      <p>Total Tasks: {total}</p>
      <p>Completed: {done}</p>
    </div>
  );
}