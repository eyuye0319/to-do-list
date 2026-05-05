export default function Header() {
  return (
    <div className="header">
      <h1>My Tasks</h1>
      <span>{new Date().toDateString()}</span>
    </div>
  );
}