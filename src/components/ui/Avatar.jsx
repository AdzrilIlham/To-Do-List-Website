import { motion } from 'framer-motion';

const avatarSVGs = {
  1: (color) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="55" r="35" fill="#fef3c7" stroke={color} strokeWidth="3" />
      <circle cx="38" cy="48" r="4" fill="#1f2937" />
      <circle cx="62" cy="48" r="4" fill="#1f2937" />
      <path d="M 42 62 Q 50 68 58 62" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="50" cy="22" rx="12" ry="8" fill="#86efac" />
      <path d="M 50 14 L 48 6 L 52 6 Z" fill="#22c55e" />
      <circle cx="30" cy="55" r="5" fill="#fca5a5" opacity="0.5" />
      <circle cx="70" cy="55" r="5" fill="#fca5a5" opacity="0.5" />
    </svg>
  ),
  2: (color) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="55" r="35" fill="#dcfce7" stroke={color} strokeWidth="3" />
      <circle cx="38" cy="48" r="4" fill="#1f2937" />
      <circle cx="62" cy="48" r="4" fill="#1f2937" />
      <path d="M 40 62 Q 50 72 60 62" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <rect x="30" y="72" width="40" height="12" rx="4" fill={color} />
      <text x="50" y="81" textAnchor="middle" fontSize="7" fill="white" fontWeight="bold">KEEP GOING</text>
      <circle cx="30" cy="55" r="5" fill="#fca5a5" opacity="0.4" />
      <circle cx="70" cy="55" r="5" fill="#fca5a5" opacity="0.4" />
    </svg>
  ),
  3: (color) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <circle cx="50" cy="55" r="35" fill="#dbeafe" stroke={color} strokeWidth="3" />
      <circle cx="38" cy="48" r="4" fill="#1f2937" />
      <circle cx="62" cy="48" r="4" fill="#1f2937" />
      <path d="M 38 62 Q 50 74 62 62" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="50,10 42,25 58,25" fill={color} />
      <rect x="35" y="22" width="30" height="6" rx="3" fill={color} />
      <rect x="28" y="72" width="44" height="10" rx="5" fill={color} />
      <text x="50" y="80" textAnchor="middle" fontSize="6" fill="white" fontWeight="bold">ON TRACK</text>
      <line x1="25" y1="45" x2="18" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="75" y1="45" x2="82" y2="42" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  4: (color) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <linearGradient id="capeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={color} />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M 25 40 Q 50 90 75 40" fill="url(#capeGrad)" opacity="0.8" />
      <circle cx="50" cy="45" r="30" fill="#ede9fe" stroke={color} strokeWidth="3" />
      <circle cx="38" cy="40" r="4" fill="#1f2937" />
      <circle cx="62" cy="40" r="4" fill="#1f2937" />
      <path d="M 40 54 Q 50 62 60 54" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <polygon points="50,8 44,18 56,18" fill="#fbbf24" />
      <polygon points="50,12 46,18 54,18" fill="#f59e0b" />
      <path d="M 15 50 L 22 45 L 18 55 Z" fill="#fbbf24" />
      <path d="M 85 50 L 78 45 L 82 55 Z" fill="#fbbf24" />
    </svg>
  ),
  5: (color) => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
      <defs>
        <radialGradient id="glowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="45" fill="url(#glowGrad)" />
      <circle cx="50" cy="52" r="32" fill="#fef9c3" stroke={color} strokeWidth="3" />
      <circle cx="40" cy="47" r="3.5" fill="#1f2937" />
      <circle cx="60" cy="47" r="3.5" fill="#1f2937" />
      <path d="M 42 60 Q 50 68 58 60" stroke="#1f2937" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M 30 25 L 35 18 L 40 26 L 45 16 L 50 28 L 55 16 L 60 26 L 65 18 L 70 25" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
      <circle cx="32" cy="55" r="4" fill="#fca5a5" opacity="0.4" />
      <circle cx="68" cy="55" r="4" fill="#fca5a5" opacity="0.4" />
      <path d="M 35 72 L 40 68 L 45 72" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M 55 72 L 60 68 L 65 72" stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  ),
};

export default function Avatar({ level = 1, size = 48 }) {
  const levelData = avatarSVGs[level] || avatarSVGs[1];
  const color = level >= 5 ? '#f59e0b' : level >= 4 ? '#a855f7' : level >= 3 ? '#3b82f6' : level >= 2 ? '#22c55e' : '#9ca3af';

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      animate={{
        y: [0, -2, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    >
      {levelData(color)}
      {level >= 5 && (
        <motion.div
          className="absolute -inset-1 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.2) 0%, transparent 70%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}
