import { useState } from 'react';
import './App.css';

type Filter = 'all' | 'active' | 'completed';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

interface TodoList {
  id: number;
  name: string;
  todos: Todo[];
}

export default function App() {
  const [lists, setLists] = useState<TodoList[]>([{ id: 1, name: 'My List', todos: [] }]);
  const [activeListId, setActiveListId] = useState(1);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [addingList, setAddingList] = useState(false);
  const [newListName, setNewListName] = useState('');

  const activeList = lists.find(l => l.id === activeListId)!;
  const todos = activeList.todos;

  function updateTodos(updater: (todos: Todo[]) => Todo[]) {
    setLists(lists.map(l => l.id === activeListId ? { ...l, todos: updater(l.todos) } : l));
  }

  function addTodo() {
    const text = input.trim();
    if (!text) return;
    updateTodos(todos => [...todos, { id: Date.now(), text, completed: false }]);
    setInput('');
  }

  function toggleTodo(id: number) {
    updateTodos(todos => todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  }

  function deleteTodo(id: number) {
    updateTodos(todos => todos.filter(t => t.id !== id));
  }

  function clearCompleted() {
    updateTodos(todos => todos.filter(t => !t.completed));
  }

  function addList() {
    const name = newListName.trim();
    if (!name) return;
    const id = Date.now();
    setLists([...lists, { id, name, todos: [] }]);
    setActiveListId(id);
    setNewListName('');
    setAddingList(false);
    setFilter('all');
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
      <nav className="sidebar" aria-label="Lists">
        {lists.map(list => (
          <button
            key={list.id}
            className={list.id === activeListId ? 'list-item selected' : 'list-item'}
            onClick={() => { setActiveListId(list.id); setFilter('all'); }}
          >
            {list.name}
          </button>
        ))}

        {addingList ? (
          <input
            className="list-name-input"
            placeholder="List name"
            value={newListName}
            autoFocus
            onChange={e => setNewListName(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') addList(); if (e.key === 'Escape') setAddingList(false); }}
            onBlur={() => { if (newListName.trim()) addList(); else setAddingList(false); }}
          />
        ) : (
          <button className="new-list-btn" onClick={() => setAddingList(true)}>+ New List</button>
        )}
      </nav>

      <main className="main">
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
      </main>
    </div>
  );
}
