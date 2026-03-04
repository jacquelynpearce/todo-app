import { useState } from 'react';
import './App.css';

type Filter = 'all' | 'active' | 'completed';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    setTodos([...todos, { id: Date.now(), text, completed: false }]);
    setInput('');
  }

  function toggleTodo(id: number) {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTodo(id: number) {
    setTodos(todos.filter(t => t.id !== id));
  }

  function clearCompleted() {
    setTodos(todos.filter(t => !t.completed));
  }

  const filtered = todos.filter(t => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  const hasCompleted = todos.some(t => t.completed);

  return (
    <div className="app">
      <h1>todos</h1>

      <input
        className="new-todo"
        placeholder="What needs to be done?"
        value={input}
        onChange={e => setInput(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && addTodo()}
      />

      {todos.length > 0 && (
        <>
          <ul className="todo-list">
            {filtered.map(todo => (
              <li key={todo.id} className={todo.completed ? 'completed' : ''}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  aria-label={todo.text}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span>{todo.text}</span>
                <button aria-label="Delete" onClick={() => deleteTodo(todo.id)}>✕</button>
              </li>
            ))}
          </ul>

          <footer className="footer">
            <span>{activeCount} {activeCount === 1 ? 'item' : 'items'} left</span>
            <span>{todos.length} tasks total</span>

            <nav>
              {(['all', 'active', 'completed'] as Filter[]).map(f => (
                <a
                  key={f}
                  href="#"
                  className={filter === f ? 'selected' : ''}
                  onClick={e => { e.preventDefault(); setFilter(f); }}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </a>
              ))}
            </nav>

            {hasCompleted && (
              <button onClick={clearCompleted}>Clear completed</button>
            )}
          </footer>
        </>
      )}
    </div>
  );
}
