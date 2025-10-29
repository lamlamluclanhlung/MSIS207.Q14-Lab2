/** @jsx createElement */
import { createElement } from './jsx-runtime';

export interface ChartProps { type: 'bar' | 'line' | 'pie'; data: { label: string; value: number }[]; width?: number; height?: number; className?: string; }

export const Chart = ({ type, data, width = 480, height = 280, className }: ChartProps) => {
  const draw = (canvas: HTMLCanvasElement | null) => {
    if (!canvas) return;
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, width, height);
    if (type === 'bar') drawBar(ctx, data, width, height);
    if (type === 'line') drawLine(ctx, data, width, height);
    if (type === 'pie') drawPie(ctx, data, width, height);
  };
  return <canvas ref={draw} width={width} height={height} className={className}
                 style={{ width: `${width}px`, height: `${height}px`, border: '1px solid #eee', borderRadius: '8px' }} />;
};

function drawBar(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number) {
  const max = Math.max(...data.map(d => d.value), 1);
  const pad = 24, gap = 10;
  const bw = (W - pad * 2 - gap * (data.length - 1)) / data.length;
  ctx.font = '12px sans-serif';
  data.forEach((d, i) => {
    const h = (d.value / max) * (H - pad * 2 - 20);
    const x = pad + i * (bw + gap);
    const y = H - pad - h;
    ctx.fillStyle = '#7aa2f7';
    ctx.fillRect(x, y, bw, h);
    ctx.fillStyle = '#111';
    ctx.fillText(String(d.label), x, H - pad + 14);
  });
}
function drawLine(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number) {
  const max = Math.max(...data.map(d => d.value), 1);
  const pad = 24;
  const step = (W - pad * 2) / (data.length - 1 || 1);
  ctx.strokeStyle = '#2e7d32';
  ctx.lineWidth = 2;
  ctx.beginPath();
  data.forEach((d, i) => {
    const x = pad + i * step;
    const y = H - pad - (d.value / max) * (H - pad * 2 - 10);
    if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
  });
  ctx.stroke();
}
function drawPie(ctx: CanvasRenderingContext2D, data: any[], W: number, H: number) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const cx = W / 2, cy = H / 2, r = Math.min(W, H) / 3;
  let angle = 0;
  data.forEach((d, i) => {
    const frac = d.value / total;
    const next = angle + frac * Math.PI * 2;
    ctx.beginPath(); ctx.moveTo(cx, cy);
    ctx.fillStyle = `hsl(${(i * 57) % 360} 70% 60%)`;
    ctx.arc(cx, cy, r, angle, next); ctx.closePath(); ctx.fill();
    angle = next;
  });
}
