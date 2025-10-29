// src/data-service.ts

export interface DataPoint {
  label: string;
  value: number;
  category: string; // 'A' | 'B' | 'C'
  date: number;     // timestamp (ms)
}

const CATS = ['A', 'B', 'C'] as const;

export class DataService {
  static categories = [...CATS];

  // Tạo dữ liệu mô phỏng
  // n: số điểm, daysSpan: dữ liệu trong vòng X ngày gần đây
  static generate(n: number = 12, daysSpan: number = 30): DataPoint[] {
    const now = Date.now();
    const arr: DataPoint[] = [];
    for (let i = 0; i < n; i++) {
      arr.push({
        label: `Item ${i + 1}`,
        value: Math.floor(10 + Math.random() * 90),
        category: CATS[Math.floor(Math.random() * CATS.length)],
        date: now - Math.floor(Math.random() * daysSpan) * 86400000
      });
    }
    return arr;
  }

  // Lọc theo category ('all' giữ nguyên)
  static filterByCategory(data: DataPoint[], cat: string): DataPoint[] {
    if (!cat || cat === 'all') return data;
    return data.filter(d => d.category === cat);
  }

  // Lọc theo số ngày gần đây
  static filterByDays(data: DataPoint[], days: number): DataPoint[] {
    const cut = Date.now() - days * 86400000;
    return data.filter(d => d.date >= cut);
  }

  // Giả lập realtime: gọi cb với dataset mới mỗi intervalMs
  // Trả về hàm dừng.
  static simulateRealtime(
    cb: (data: DataPoint[]) => void,
    intervalMs: number = 1000,
    n: number = 12,
    daysSpan: number = 30
  ): () => void {
    const id = setInterval(() => cb(DataService.generate(n, daysSpan)), intervalMs);
    return () => clearInterval(id);
  }
}
