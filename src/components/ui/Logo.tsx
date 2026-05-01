interface LogoProps {
  size?: number
  showText?: boolean
  className?: string
}

export default function Logo({ size = 32, showText = true, className = "" }: LogoProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="ff-bg" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1d4ed8" />
          </linearGradient>
        </defs>

        {/* 배경 */}
        <rect width="100" height="100" rx="24" fill="url(#ff-bg)" />

        {/* 뒷 카드 (반투명, 좌측 회전) */}
        <rect
          x="22"
          y="28"
          width="56"
          height="44"
          rx="8"
          fill="white"
          fillOpacity="0.35"
          transform="rotate(-12 50 50)"
        />

        {/* 앞 카드 (선명, 우측 회전) */}
        <rect
          x="22"
          y="28"
          width="56"
          height="44"
          rx="8"
          fill="white"
          transform="rotate(8 50 50)"
        />
      </svg>
      {showText && (
        <span className="font-bold text-blue-600 leading-none dark:text-blue-400">
          Flip &amp; Flow
        </span>
      )}
    </div>
  )
}
