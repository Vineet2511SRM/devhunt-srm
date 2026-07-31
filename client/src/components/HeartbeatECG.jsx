import React from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';

/**
 * Dynamic Heartbeat BPM Calculator
 * Base Pulse: 60 BPM
 * + 10 BPM per project shipped
 * + 5 BPM per review
 * + 2 BPM per upvote
 * + 15 BPM per level
 */
export const calculateBPM = ({ projectsCount = 0, reviewsCount = 0, upvotesCount = 0, level = 1 } = {}) => {
  const baseBPM = 60;
  const projectBonus = projectsCount * 10;
  const reviewBonus = reviewsCount * 5;
  const upvoteBonus = upvotesCount * 2;
  const levelBonus = Math.max(0, level - 1) * 15;

  const calculated = baseBPM + projectBonus + reviewBonus + upvoteBonus + levelBonus;
  return Math.min(220, Math.max(60, calculated)); // Cap at 220 BPM max
};

const HeartbeatECG = ({
  height = 48,
  customBPM = null,
  projectsCount = 0,
  reviewsCount = 0,
  upvotesCount = 0,
  label = null,
}) => {
  const { user } = useAuth();

  // Determine dynamic BPM based on user activity or custom props
  const userLevel = user?.level || 1;
  const userXP = user?.xp || 0;

  // If customBPM is passed, use it; otherwise compute from user stats + props
  const activeBPM = customBPM || calculateBPM({
    projectsCount: projectsCount || (user ? 1 : 0),
    reviewsCount: reviewsCount || Math.floor(userXP / 20),
    upvotesCount: upvotesCount || Math.floor(userXP / 10),
    level: userLevel,
  });

  // Calculate dynamic sweep speed (Higher BPM = Faster animation duration)
  // 60 BPM -> 2.4s, 120 BPM -> 1.2s, 180 BPM -> 0.8s, 220 BPM -> 0.6s
  const animationDuration = `${(14400 / activeBPM / 100).toFixed(2)}s`;

  // Color dynamic shift: Volt Yellow (#DFE104) at normal -> Neon Orange/Red (#FF4500) at Hyper Overdrive
  const isHyper = activeBPM >= 120;
  const isExtreme = activeBPM >= 160;

  const pulseColor = isExtreme ? '#FF2A00' : isHyper ? '#FF8800' : '#dfe104';
  const pulseStatusText = isExtreme ? 'MAX OVERDRIVE' : isHyper ? 'ADRENALINE PULSE' : 'NORMAL RHYTHM';

  const defaultLabel = label || `CAMPUS PULSE: ${activeBPM} BPM [${pulseStatusText}]`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, width: '100%', overflow: 'hidden' }}>
      {defaultLabel && (
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 800,
            color: pulseColor,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            transition: 'color 0.3s ease',
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: pulseColor,
              boxShadow: `0 0 14px ${pulseColor}`,
              animation: `heartbeat ${Math.max(0.4, 60 / activeBPM)}s infinite`,
            }}
          />
          {defaultLabel}
        </span>
      )}

      <div style={{ flex: 1, height, position: 'relative', overflow: 'hidden' }}>
        <svg
          viewBox="0 0 600 100"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: '100%',
            filter: `drop-shadow(0 0 ${isHyper ? 12 : 6}px ${pulseColor})`,
          }}
        >
          {/* Faint Guide Line */}
          <line x1="0" y1="50" x2="600" y2="50" stroke="#3F3F46" strokeWidth="1" strokeDasharray="4 4" />

          {/* ECG Pulse Wave Line (Smooth Bezier Curve) */}
          <path
            d="M 0,50 Q 100,50 120,50 C 130,50 135,38 142,50 C 148,60 152,50 160,50 C 185,50 195,50 205,50 C 210,35 215,12 222,12 C 230,92 235,92 242,88 C 248,18 252,55 258,50 C 280,50 300,50 320,50 C 330,42 340,58 350,50 Q 450,50 600,50"
            fill="none"
            stroke={pulseColor}
            strokeWidth={isHyper ? '3.5' : '2.5'}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="ecg-line-pulse"
            style={{
              animationDuration: animationDuration,
              transition: 'stroke 0.5s ease',
            }}
          />
        </svg>
      </div>
    </div>
  );
};

export default HeartbeatECG;
