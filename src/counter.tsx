/** @jsx createElement */
import { createElement, useState, type Child } from './jsx-runtime';

interface ButtonProps {
  onClick?: (e: MouseEvent) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  children?: Child | Child[]; // cho phép 1 phần tử hoặc mảng
}

const Button = ({ onClick, className, type = 'button', children }: ButtonProps) => {
  return (
    <button type={type} onClick={onClick as any} className={className}>
      {children}
    </button>
  );
};

interface CounterProps {
  initialCount?: number;
  className?: string;
}

const Counter = ({ initialCount = 0, className }: CounterProps) => {
  const [getCount, setCount] = useState<number>(initialCount);

  const inc = () => setCount(v => v + 1);
  const dec = () => setCount(v => v - 1);
  const reset = () => setCount(initialCount);

  return (
    <div
      className={className ?? 'counter'}
      style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}
    >
      <h2>Count: {getCount()}</h2>
      <div className="buttons" style={{ display: 'flex', gap: '8px' }}>
        <Button onClick={inc}>+</Button>
        <Button onClick={dec}>-</Button>
        <Button onClick={reset}>Reset</Button>
      </div>
    </div>
  );
};

export { Counter };
