/** @jsx createElement */
import { createElement, mount } from './jsx-runtime';

const Perf = () => {
  const run = () => {
    const t0 = performance.now();
    const nodes = [];
    for (let i = 0; i < 5000; i++) {
      nodes.push(<div className="box">{i}</div>);
    }
    const t1 = performance.now();

    const root = document.createElement('div');
    mount(<div>{nodes}</div> as any, root);
    const t2 = performance.now();

    alert(`createElement: ${(t1 - t0).toFixed(1)}ms\nrenderToDOM+mount: ${(t2 - t1).toFixed(1)}ms`);
  };

  return (
    <div style={{ padding: '12px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h2>Benchmark</h2>
      <button onClick={run}>Run 5k nodes</button>
    </div>
  );
};

export { Perf };
