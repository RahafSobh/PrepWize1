interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const dims = size === 'sm' ? 32 : size === 'lg' ? 56 : 44;

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: dims, height: dims }}
    >
      <svg viewBox="0 0 100 100" width={dims} height={dims} aria-hidden="true">
        <defs>
          <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6C63FF" />
            <stop offset="100%" stopColor="#3ECFB2" />
          </linearGradient>
        </defs>
        <polygon
          points="50,8 88,30 88,70 50,92 12,70 12,30"
          fill="none"
          stroke="url(#logo-grad)"
          strokeWidth="3"
        />
        <polygon
          points="50,22 74,36 74,64 50,78 26,64 26,36"
          fill="url(#logo-grad)"
          opacity="0.15"
        />
        <circle cx="50" cy="50" r="10" fill="url(#logo-grad)" />
      </svg>
    </div>
  );
}
