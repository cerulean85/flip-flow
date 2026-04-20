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
        <rect width="100" height="100" rx="22" fill="#6366f1" />
        <rect x="9" y="20" width="58" height="44" rx="7" fill="#a5b4fc" transform="rotate(-12, 38, 42)" />
        <rect x="31" y="32" width="58" height="44" rx="7" fill="white" />
        <rect x="42" y="44" width="28" height="4" rx="2" fill="#6366f1" opacity="0.45" />
        <rect x="42" y="53" width="20" height="4" rx="2" fill="#6366f1" opacity="0.28" />
        <rect x="42" y="62" width="24" height="4" rx="2" fill="#6366f1" opacity="0.18" />
      </svg>
      {showText && (
        <span className="font-bold text-indigo-600 leading-none">
          Flip &amp; Flow
        </span>
      )}
    </div>
  )
}
