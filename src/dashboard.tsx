/** @jsx createElement */
import { createElement, useState } from './jsx-runtime';
import { Card } from './components';
import { Chart } from './chart';
import { DataService, type DataPoint } from './data-service';

const Dashboard = () => {
  const [getType, setType] = useState<'bar' | 'line' | 'pie'>('bar');
  const [getData, setData] = useState<DataPoint[]>(DataService.generate(12, 30));
  const [getCat, setCat] = useState<'all' | 'A' | 'B' | 'C'>('all');
  const [getDays, setDays] = useState<7 | 14 | 30>(30);
  const [getLive, setLive] = useState(false);

  // Generate theo "Days" hiện tại để tránh dataset rỗng
  const refresh = () => setData(DataService.generate(12, getDays()));

  // --- Realtime ---
  let stopRef: { stop?: () => void } = {};
  const startLive = () => {
    if (getLive()) return;
    setLive(true);
    stopRef.stop = DataService.simulateRealtime(setData, 1000, 12);
  };
  const stopLive = () => {
    setLive(false);
    stopRef.stop?.();
    stopRef.stop = undefined;
  };

  // --- Filters ---
  const filtered = DataService.filterByDays(
    DataService.filterByCategory(getData(), getCat()),
    getDays()
  );

  return (
    <div style={{ display: 'grid', gap: '12px' }}>
      <h2>Mini Dashboard</h2>

      <Card>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <strong>Chart:</strong>
          <select
            value={getType()}
            onChange={(e: any) => setType(e.target.value as 'bar' | 'line' | 'pie')}
          >
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>

          <strong>Category:</strong>
          <select value={getCat()} onChange={(e: any) => setCat(e.target.value)}>
            <option value="all">All</option>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
          </select>

          <strong>Days:</strong>
          <select
            value={String(getDays())}                                   
            onChange={(e: any) => setDays(parseInt(e.target.value, 10) as 7 | 14 | 30)}
          >
            <option value="7">7</option>
            <option value="14">14</option>
            <option value="30">30</option>
          </select>

          <button onClick={refresh}>Regenerate</button>
          {!getLive() ? (
            <button onClick={startLive}>Start Live</button>
          ) : (
            <button onClick={stopLive}>Stop Live</button>
          )}
        </div>
      </Card>

      <Card>
        <Chart
          type={getType()}
          data={filtered.map(d => ({ label: d.label, value: d.value }))}
        />
      </Card>
    </div>
  );
};

export { Dashboard };
