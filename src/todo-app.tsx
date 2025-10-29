/** @jsx createElement */
import { createElement, useState } from './jsx-runtime';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: number;
}

interface TodoItemProps {
  key?: string | number;                
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

const TodoItem = ({ todo, onToggle, onDelete }: TodoItemProps) => {
  return (
    <li style={{ display: 'flex', gap: '8px', alignItems: 'center', padding: '4px 0' }}>
      <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)} />
      <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', flex: '1' }}>{todo.text}</span>
      <button onClick={() => onDelete(todo.id)}>Delete</button>
    </li>
  );
};

interface AddTodoFormProps { onAdd: (text: string) => void; }

const AddTodoForm = ({ onAdd }: AddTodoFormProps) => {
  const [getText, setText] = useState<string>('');
  const submit = (e: Event) => {
    e.preventDefault();
    const t = getText().trim();
    if (!t) return;
    onAdd(t);
    setText('');
  };
  return (
    <form onSubmit={submit as any} style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
      <input
        type="text"
        placeholder="Add todo..."
        value={getText()}
        onInput={(e: any) => setText(e.target.value)}
        style={{ flex: '1' }}
      />
      <button type="submit">Add</button>
    </form>
  );
};

const TodoApp = () => {
  const [getTodos, setTodos] = useState<Todo[]>([]);
  const [getFilter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const add = (text: string) =>
    setTodos(list => [{ id: Date.now(), text, completed: false, createdAt: Date.now() }, ...list]);
  const toggle = (id: number) =>
    setTodos(list => list.map(t => (t.id === id ? { ...t, completed: !t.completed } : t)));
  const del = (id: number) => setTodos(list => list.filter(t => t.id !== id));

  const todos = getTodos();
  const filtered =
    getFilter() === 'active' ? todos.filter(t => !t.completed)
    : getFilter() === 'completed' ? todos.filter(t => t.completed)
    : todos;

  const total = todos.length;
  const done = todos.filter(t => t.completed).length;

  return (
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Todo List</h2>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button onClick={() => setFilter('all')}>All</button>
        <button onClick={() => setFilter('active')}>Active</button>
        <button onClick={() => setFilter('completed')}>Completed</button>
      </div>

      <AddTodoForm onAdd={add} />
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {filtered.map(t => (
          <TodoItem key={t.id} todo={t} onToggle={toggle} onDelete={del} />
        ))}
      </ul>

      <p style={{ marginTop: '8px' }}>
        Total: {total} — Completed: {done}
      </p>
    </div>
  );
};

export { TodoApp };
