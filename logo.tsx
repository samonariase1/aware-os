interface LogoProps {
  className?: string;
  processing?: boolean; // Controls the breathing animation
}

export default function Logo({ className = "", processing = false }: LogoProps) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className}`}
    >
      {/* Outer Aperture Ring (Static) */}
      <path
        d="M50 5 L50 15 M50 85 L50 95 M5 50 L15 50 M85 50 L95 50"
        stroke="#00E0FF"
        strokeWidth="4"
        strokeLinecap="round"
        className="opacity-50"
      />
      <circle
        cx="50"
        cy="50"
        r="38"
        stroke="#00E0FF"
        strokeWidth="2"
        strokeDasharray="60 15"
        className="opacity-80"
      />
      
      {/* Inner Lens / Pupil (Breathing Animation) */}
      <circle
        cx="50"
        cy="50"
        r="12"
        fill="#00E0FF"
        className={`
          origin-center transition-all duration-700
          ${processing ? 'animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]' : 'opacity-100'}
        `}
      />
      
      {/* Dynamic Focus Brackets (Rotate when processing) */}
      <g className={`origin-center transition-transform duration-[2000ms] ${processing ? 'animate-[spin_4s_linear_infinite]' : ''}`}>
         <path
           d="M30 20 L20 20 L20 30 M80 20 L70 20 L80 30 M30 80 L20 80 L20 70 M80 70 L80 80 L70 80"
           stroke="#00E0FF"
           strokeWidth="2"
           strokeLinecap="square"
           className="opacity-40"
         />
      </g>
    </svg>
  );
}