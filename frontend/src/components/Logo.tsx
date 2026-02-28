interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizes = {
    sm: { width: 100, height: 28 },
    md: { width: 140, height: 40 },
    lg: { width: 200, height: 56 },
  };

  const { width, height } = sizes[size];

  return (
    <svg
      viewBox="0 0 200 56"
      width={width}
      height={height}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* BAND text */}
      <text
        x="0"
        y="40"
        fill="white"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="36"
        fontWeight="300"
        letterSpacing="4"
      >
        BAND
      </text>
      
      {/* Z shape with rubber band styling and bracket endpoints */}
      <g transform="translate(122, 8)">
        {/* Top horizontal line */}
        <line
          x1="8"
          y1="8"
          x2="60"
          y2="8"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Diagonal line */}
        <line
          x1="60"
          y1="8"
          x2="8"
          y2="40"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Bottom horizontal line */}
        <line
          x1="8"
          y1="40"
          x2="60"
          y2="40"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Top left bracket/square */}
        <rect
          x="2"
          y="2"
          width="10"
          height="10"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Top right bracket/square */}
        <rect
          x="56"
          y="2"
          width="10"
          height="10"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Bottom left bracket/square */}
        <rect
          x="2"
          y="36"
          width="10"
          height="10"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
        
        {/* Bottom right bracket/square */}
        <rect
          x="56"
          y="36"
          width="10"
          height="10"
          fill="none"
          stroke="white"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
}
