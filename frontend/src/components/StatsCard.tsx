import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  trending?: {
    direction: 'up' | 'down';
    positive: boolean;
    label: string;
  };
  variant?: 'green' | 'red' | 'dark';
  className?: string;
}

export default function StatsCard({
  title,
  value,
  trending,
  variant = 'green',
  className = '',
}: StatsCardProps) {
  const containerClass =
    variant === 'green'
      ? 'bg-gradient-to-br from-green-primary to-green-secondary text-black'
      : variant === 'red'
      ? 'bg-gradient-to-br from-red-500 to-red-600 text-white'
      : 'bg-bg-secondary border border-border text-text-primary';

  const labelClass =
    variant === 'green'
      ? 'text-black/65'
      : variant === 'red'
      ? 'text-white/65'
      : 'text-text-secondary';

  const trendColorClass =
    variant === 'green' || variant === 'red'
      ? trending?.positive
        ? 'text-black/70'
        : 'text-black/50'
      : trending?.positive
      ? 'text-green-primary'
      : 'text-red-400';

  const TrendIcon = trending?.direction === 'up' ? TrendingUp : TrendingDown;

  return (
    <div className={`rounded-2xl p-6 min-w-[180px] text-center ${containerClass} ${className}`}>
      <p className={`text-sm font-medium mb-3 ${labelClass}`}>{title}</p>
      <p className="text-4xl font-bold">{value}</p>
      {trending && (
        <div className={`flex items-center justify-center gap-1.5 mt-2.5 ${trendColorClass}`}>
          <TrendIcon size={14} />
          <span className="text-xs font-semibold">{trending.label}</span>
        </div>
      )}
    </div>
  );
}
