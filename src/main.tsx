/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';
import { Counter } from './counter';
import { TodoApp } from './todo-app';
import { Dashboard } from './dashboard';
import { Perf } from './perf';

const App = () => {
  const render = (Comp: any) => {
    const root = document.getElementById('root')!;
    root.innerHTML = '';
    mount(<div style={{ display: 'grid', gap: '12px' }}><Comp /></div> as any, root);
  };

  const Tab = (label: string, view: any) =>
    <button onClick={() => render(view)} style={{ padding: '6px 10px' }}>{label}</button>;

  // mở mặc định Dashboard
  setTimeout(() => render(Dashboard), 0);

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <h1>Lab 2 — JSX + TS (No React)</h1>
      <div style={{ display: 'flex', gap: '8px' }}>
        {Tab('Counter', Counter)}
        {Tab('Todo', TodoApp)}
        {Tab('Dashboard', Dashboard)}
        {Tab('Bench', Perf)}
      </div>
      <div id="root"></div>
    </div>
  );
};

const container = document.getElementById('app')!;
mount(<App /> as any, container);
