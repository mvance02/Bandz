import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  ResponsiveContainer,
  CartesianGrid,
  Tooltip,
} from 'recharts';

interface CompliancePoint {
  label: string;
  value: number;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-tertiary border border-border rounded-xl p-3 shadow-xl">
        <p className="text-text-muted text-xs mb-1">{label}</p>
        <p className="text-green-primary font-semibold text-sm">{payload[0]?.value}%</p>
      </div>
    );
  }
  return null;
};

export default function ComplianceChart({ data }: { data: CompliancePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={130}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" vertical={false} />
        <XAxis
          dataKey="label"
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 11 }}
          dy={8}
        />
        <YAxis
          axisLine={false}
          tickLine={false}
          tick={{ fill: '#71717a', fontSize: 11 }}
          domain={[0, 100]}
          dx={-8}
          tickFormatter={(v) => `${v}%`}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#4ade80"
          strokeWidth={2.5}
          dot={{ fill: '#4ade80', strokeWidth: 0, r: 4 }}
          activeDot={{ r: 6, fill: '#4ade80' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
