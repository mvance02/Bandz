import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

interface WeekData {
  week: string;
  dateRange: string;
  morning: number;
  noon: number;
  night: number;
}

interface BarChartProps {
  data: WeekData[];
  showLegend?: boolean;
}

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-bg-tertiary border border-border rounded-xl p-4 shadow-xl">
        <p className="text-text-primary font-semibold mb-2">{label}</p>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#a7f3d0]" />
            <span className="text-text-secondary text-sm">Morning:</span>
            <span className="text-text-primary font-medium">{payload[0]?.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-primary" />
            <span className="text-text-secondary text-sm">Noon:</span>
            <span className="text-text-primary font-medium">{payload[1]?.value}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-secondary" />
            <span className="text-text-secondary text-sm">Night:</span>
            <span className="text-text-primary font-medium">{payload[2]?.value}</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function BarChart({ data, showLegend = true }: BarChartProps) {
  return (
    <div className="w-full">
      {showLegend && (
        <div className="flex items-center gap-6 mb-6 justify-start" style={{ paddingLeft: '1.5rem' }}>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-[#a7f3d0] rounded-sm" />
            <span className="text-sm text-text-secondary">Morning</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-primary rounded-sm" />
            <span className="text-sm text-text-secondary">Noon</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-secondary rounded-sm" />
            <span className="text-sm text-text-secondary">Night</span>
          </div>
        </div>
      )}
      
      <ResponsiveContainer width="100%" height={220}>
        <RechartsBarChart data={data} barGap={3} barCategoryGap="20%">
          <XAxis
            dataKey="dateRange"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#a1a1aa', fontSize: 12 }}
            domain={[0, 100]}
            dx={-10}
          />
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: 'rgba(255,255,255,0.05)', radius: 4 }}
          />
          <Bar 
            dataKey="morning" 
            fill="#a7f3d0" 
            radius={[4, 4, 0, 0]} 
            barSize={14}
          />
          <Bar 
            dataKey="noon" 
            fill="#4ade80" 
            radius={[4, 4, 0, 0]} 
            barSize={14}
          />
          <Bar 
            dataKey="night" 
            fill="#22c55e" 
            radius={[4, 4, 0, 0]} 
            barSize={14}
          />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
