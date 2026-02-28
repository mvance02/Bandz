import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface DonutChartProps {
  activePercent: number;
  inactivePercent: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export default function DonutChart({
  activePercent,
  inactivePercent,
  size = 'md',
  showLabels = true,
}: DonutChartProps) {
  const data = [
    { name: 'Active', value: activePercent },
    { name: 'Inactive', value: inactivePercent },
  ];

  const COLORS = ['#4ade80', '#5eead4'];
  
  const dimensions = {
    sm: { width: 120, height: 120, innerRadius: 35, outerRadius: 50 },
    md: { width: 180, height: 180, innerRadius: 55, outerRadius: 75 },
    lg: { width: 220, height: 220, innerRadius: 70, outerRadius: 95 },
  };

  const { width, height, innerRadius, outerRadius } = dimensions[size];

  return (
    <div className="flex flex-col items-center">
      {showLabels && (
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-primary rounded-sm" />
            <span className="text-xs text-text-secondary">Active</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-teal-accent rounded-sm" />
            <span className="text-xs text-text-secondary">Inactive</span>
          </div>
        </div>
      )}
      
      <div style={{ width, height }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              startAngle={90}
              endAngle={-270}
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-text-secondary text-xs">Active</span>
          <span className="text-text-primary text-lg font-bold">{activePercent}%</span>
        </div>
      </div>

      {/* Side labels */}
      {showLabels && (
        <div className="flex justify-between w-full mt-2 text-xs">
          <div className="text-text-secondary">
            <span className="text-teal-accent">Inactive</span>
            <br />
            {inactivePercent}%
          </div>
        </div>
      )}
    </div>
  );
}
