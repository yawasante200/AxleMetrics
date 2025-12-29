// This is VehicleIllustrations.tsx
// It contains SVG components for vehicle illustrations
// Each vehicle is an SVG component for optimal rendering in PDFs
import React from 'react';

// Simple, clean line-drawing style vehicle illustrations
// Each vehicle is an SVG component for optimal rendering in PDFs

interface VehicleIconProps {
  className?: string;
  size?: number;
}

// Small Bus - 2 axle
export const SmallBusIcon: React.FC<VehicleIconProps> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 80 32" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Body */}
    <rect x="8" y="6" width="64" height="18" rx="2" fill="#f8fafc" stroke="#374151" />
    {/* Windows */}
    <rect x="12" y="9" width="8" height="8" rx="1" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="24" y="9" width="8" height="8" rx="1" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="36" y="9" width="8" height="8" rx="1" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="48" y="9" width="8" height="8" rx="1" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="60" y="9" width="8" height="8" rx="1" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="20" cy="26" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="20" cy="26" r="2" fill="#9ca3af" />
    <circle cx="60" cy="26" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="60" cy="26" r="2" fill="#9ca3af" />
  </svg>
);

// Large Bus - 3 axle
export const LargeBusIcon: React.FC<VehicleIconProps> = ({ className = '', size = 100 }) => (
  <svg width={size} height={size * 0.35} viewBox="0 0 100 35" className={className} fill="none" stroke="currentColor" strokeWidth="1.5">
    {/* Body */}
    <rect x="5" y="5" width="90" height="20" rx="2" fill="#fef3c7" stroke="#374151" />
    {/* Windows */}
    {[10, 22, 34, 46, 58, 70, 82].map((x, i) => (
      <rect key={i} x={x} y="8" width="8" height="10" rx="1" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    ))}
    {/* Wheels - 3 axles */}
    <circle cx="18" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="18" cy="28" r="2" fill="#9ca3af" />
    <circle cx="70" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="70" cy="28" r="2" fill="#9ca3af" />
    <circle cx="85" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="85" cy="28" r="2" fill="#9ca3af" />
  </svg>
);

// Light Truck - 2 axle
export const LightTruckIcon: React.FC<VehicleIconProps> = ({ className = '', size = 70 }) => (
  <svg width={size} height={size * 0.45} viewBox="0 0 70 32" className={className} fill="none" strokeWidth="1.5">
    {/* Cab */}
    <path d="M5 18 L5 8 L20 8 L25 4 L35 4 L35 18 Z" fill="#dbeafe" stroke="#374151" />
    {/* Windshield */}
    <path d="M20 8 L25 4 L32 4 L32 8 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    {/* Bed */}
    <rect x="35" y="8" width="30" height="10" fill="#f3f4f6" stroke="#374151" />
    {/* Wheels */}
    <circle cx="15" cy="24" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="15" cy="24" r="2" fill="#9ca3af" />
    <circle cx="55" cy="24" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="55" cy="24" r="2" fill="#9ca3af" />
  </svg>
);

// Medium Truck - 2 axle single unit
export const MediumTruckIcon: React.FC<VehicleIconProps> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 80 32" className={className} fill="none" strokeWidth="1.5">
    {/* Cab */}
    <path d="M5 18 L5 8 L15 8 L22 2 L28 2 L28 18 Z" fill="#dcfce7" stroke="#374151" />
    {/* Windshield */}
    <path d="M15 8 L22 2 L26 2 L26 8 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    {/* Cargo box */}
    <rect x="28" y="4" width="47" height="14" fill="#fef9c3" stroke="#374151" />
    {/* Wheels */}
    <circle cx="18" cy="25" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="18" cy="25" r="2.5" fill="#9ca3af" />
    <circle cx="62" cy="25" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="62" cy="25" r="2.5" fill="#9ca3af" />
  </svg>
);

// Heavy Truck - 3 axle single unit
export const HeavyTruckIcon: React.FC<VehicleIconProps> = ({ className = '', size = 90 }) => (
  <svg width={size} height={size * 0.38} viewBox="0 0 90 34" className={className} fill="none" strokeWidth="1.5">
    {/* Cab */}
    <path d="M5 20 L5 10 L15 10 L22 4 L28 4 L28 20 Z" fill="#fee2e2" stroke="#374151" />
    {/* Windshield */}
    <path d="M15 10 L22 4 L26 4 L26 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    {/* Cargo box */}
    <rect x="28" y="4" width="57" height="16" fill="#fecaca" stroke="#374151" />
    {/* Wheels - tandem rear */}
    <circle cx="18" cy="27" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="18" cy="27" r="2.5" fill="#9ca3af" />
    <circle cx="65" cy="27" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="65" cy="27" r="2.5" fill="#9ca3af" />
    <circle cx="80" cy="27" r="6" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="80" cy="27" r="2.5" fill="#9ca3af" />
  </svg>
);

// Generic trailer icon generator for various axle counts
const generateTrailerWheels = (axleCount: number, startX: number, wheelSpacing: number): JSX.Element[] => {
  const wheels: JSX.Element[] = [];
  // Tractor wheels (first 3)
  [14, 32, 45].forEach((cx, idx) => {
    wheels.push(<circle key={`tractor-${idx}`} cx={cx} cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />);
    wheels.push(<circle key={`tractor-hub-${idx}`} cx={cx} cy="28" r="1.5" fill="#9ca3af" />);
  });
  // Trailer wheels
  const trailerAxles = axleCount - 3;
  for (let i = 0; i < trailerAxles; i++) {
    const cx = startX + (i * wheelSpacing);
    wheels.push(<circle key={`trailer-${i}`} cx={cx} cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />);
    wheels.push(<circle key={`trailer-hub-${i}`} cx={cx} cy="28" r="1.5" fill="#9ca3af" />);
  }
  return wheels;
};

// 3-axle trailer
export const Trailer3AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 100 }) => (
  <svg width={size} height={size * 0.32} viewBox="0 0 100 32" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 20 L3 10 L10 10 L16 5 L22 5 L22 20 Z" fill="#dbeafe" stroke="#374151" />
    <rect x="26" y="5" width="70" height="15" fill="#93c5fd" stroke="#374151" />
    <line x1="22" y1="16" x2="26" y2="16" stroke="#374151" strokeWidth="2" />
    {generateTrailerWheels(3, 85, 0)}
  </svg>
);

// 4-axle trailer
export const Trailer4AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 110 }) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 110 33" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 20 L3 10 L10 10 L16 5 L22 5 L22 20 Z" fill="#dbeafe" stroke="#374151" />
    <rect x="26" y="5" width="80" height="15" fill="#fcd34d" stroke="#374151" />
    <line x1="22" y1="16" x2="26" y2="16" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="26" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="26" r="1.5" fill="#9ca3af" />
    <circle cx="30" cy="26" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="30" cy="26" r="1.5" fill="#9ca3af" />
    <circle cx="90" cy="26" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="90" cy="26" r="1.5" fill="#9ca3af" />
    <circle cx="102" cy="26" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="102" cy="26" r="1.5" fill="#9ca3af" />
  </svg>
);

// 5-axle trailer (Semi-Trailer)
export const SemiTrailer5AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 120 }) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 120 36" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 22 L3 10 L12 10 L18 4 L24 4 L24 22 Z" fill="#dbeafe" stroke="#374151" />
    <path d="M12 10 L18 4 L22 4 L22 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="28" y="4" width="88" height="18" fill="#bfdbfe" stroke="#374151" />
    <line x1="24" y1="18" x2="28" y2="18" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="28" r="2" fill="#9ca3af" />
    <circle cx="32" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="32" cy="28" r="2" fill="#9ca3af" />
    <circle cx="45" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="45" cy="28" r="2" fill="#9ca3af" />
    <circle cx="100" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="100" cy="28" r="2" fill="#9ca3af" />
    <circle cx="113" cy="28" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="113" cy="28" r="2" fill="#9ca3af" />
  </svg>
);

// 6-axle trailer
export const SemiTrailer6AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 130 }) => (
  <svg width={size} height={size * 0.28} viewBox="0 0 130 36" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 22 L3 10 L12 10 L18 4 L24 4 L24 22 Z" fill="#d1fae5" stroke="#374151" />
    <path d="M12 10 L18 4 L22 4 L22 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="28" y="4" width="98" height="18" fill="#a7f3d0" stroke="#374151" />
    <line x1="24" y1="18" x2="28" y2="18" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="30" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="30" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="44" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="44" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="95" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="95" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="108" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="108" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="121" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="121" cy="28" r="1.5" fill="#9ca3af" />
  </svg>
);

// 7-axle trailer
export const Trailer7AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 140 }) => (
  <svg width={size} height={size * 0.26} viewBox="0 0 140 36" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 22 L3 10 L12 10 L18 4 L24 4 L24 22 Z" fill="#fef3c7" stroke="#374151" />
    <path d="M12 10 L18 4 L22 4 L22 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="28" y="4" width="108" height="18" fill="#fde68a" stroke="#374151" />
    <line x1="24" y1="18" x2="28" y2="18" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="30" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="30" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="44" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="44" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="90" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="90" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="103" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="103" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="116" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="116" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="129" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="129" cy="28" r="1.5" fill="#9ca3af" />
  </svg>
);

// 8-axle trailer
export const Trailer8AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 150 }) => (
  <svg width={size} height={size * 0.24} viewBox="0 0 150 36" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 22 L3 10 L12 10 L18 4 L24 4 L24 22 Z" fill="#fce7f3" stroke="#374151" />
    <path d="M12 10 L18 4 L22 4 L22 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="28" y="4" width="118" height="18" fill="#fbcfe8" stroke="#374151" />
    <line x1="24" y1="18" x2="28" y2="18" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="30" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="30" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="44" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="44" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="90" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="90" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="103" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="103" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="116" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="116" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="129" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="129" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="142" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="142" cy="28" r="1.5" fill="#9ca3af" />
  </svg>
);

// 9-axle trailer
export const Trailer9AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 160 }) => (
  <svg width={size} height={size * 0.22} viewBox="0 0 160 36" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 22 L3 10 L12 10 L18 4 L24 4 L24 22 Z" fill="#e0e7ff" stroke="#374151" />
    <path d="M12 10 L18 4 L22 4 L22 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="28" y="4" width="128" height="18" fill="#c7d2fe" stroke="#374151" />
    <line x1="24" y1="18" x2="28" y2="18" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="30" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="30" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="44" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="44" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="85" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="85" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="98" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="98" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="111" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="111" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="124" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="124" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="137" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="137" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="150" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="150" cy="28" r="1.5" fill="#9ca3af" />
  </svg>
);

// 10-axle trailer
export const Trailer10AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 170 }) => (
  <svg width={size} height={size * 0.21} viewBox="0 0 170 36" className={className} fill="none" strokeWidth="1.5">
    <path d="M3 22 L3 10 L12 10 L18 4 L24 4 L24 22 Z" fill="#fee2e2" stroke="#374151" />
    <path d="M12 10 L18 4 L22 4 L22 10 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <rect x="28" y="4" width="138" height="18" fill="#fecaca" stroke="#374151" />
    <line x1="24" y1="18" x2="28" y2="18" stroke="#374151" strokeWidth="2" />
    <circle cx="14" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="14" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="30" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="30" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="44" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="44" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="80" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="80" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="93" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="93" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="106" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="106" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="119" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="119" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="132" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="132" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="145" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="145" cy="28" r="1.5" fill="#9ca3af" />
    <circle cx="158" cy="28" r="4" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="158" cy="28" r="1.5" fill="#9ca3af" />
  </svg>
);

// Passenger Car
export const PassengerCarIcon: React.FC<VehicleIconProps> = ({ className = '', size = 60 }) => (
  <svg width={size} height={size * 0.45} viewBox="0 0 60 27" className={className} fill="none" strokeWidth="1.5">
    {/* Body */}
    <path d="M5 17 L5 12 L12 12 L18 5 L42 5 L48 12 L55 12 L55 17 Z" fill="#e0e7ff" stroke="#374151" />
    {/* Windows */}
    <path d="M18 6 L15 11 L26 11 L26 6 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <path d="M28 6 L28 11 L38 11 L38 6 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    <path d="M40 6 L40 11 L46 12 L44 6 Z" fill="#e0f2fe" stroke="#374151" strokeWidth="1" />
    {/* Wheels */}
    <circle cx="15" cy="20" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="15" cy="20" r="2" fill="#9ca3af" />
    <circle cx="45" cy="20" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1" />
    <circle cx="45" cy="20" r="2" fill="#9ca3af" />
  </svg>
);

// Vehicle classification lookup
export interface VehicleClassification {
  name: string;
  code: string;
  axles: number;
  icon: React.FC<VehicleIconProps>;
  description: string;
}

export const vehicleClassifications: VehicleClassification[] = [
  { name: 'Passenger Car', code: 'PC', axles: 2, icon: PassengerCarIcon, description: '2 axles, 4 tires' },
  { name: 'Small Buses', code: 'SB', axles: 2, icon: SmallBusIcon, description: '2 axles' },
  { name: 'Medium Buses', code: 'MB', axles: 2, icon: SmallBusIcon, description: '2 axles' },
  { name: 'Large Buses (2-axle)', code: 'LB2', axles: 2, icon: SmallBusIcon, description: '2 axles' },
  { name: 'Large Buses (3-axle)', code: 'LB3', axles: 3, icon: LargeBusIcon, description: '3 axles' },
  { name: 'Light Trucks', code: 'LT', axles: 2, icon: LightTruckIcon, description: '2 axles, pickup/van' },
  { name: 'Medium Trucks', code: 'MT1', axles: 2, icon: MediumTruckIcon, description: '2 axles' },
  { name: 'Heavy Trucks', code: 'HT5', axles: 3, icon: HeavyTruckIcon, description: '3+ axles' },
  { name: '3-axle trailers', code: '3T1', axles: 3, icon: Trailer3AxleIcon, description: 'Tractor + trailer' },
  { name: '4-axle trailers', code: '4T1', axles: 4, icon: Trailer4AxleIcon, description: 'Tractor + trailer' },
  { name: '5-axle trailers', code: '5T1', axles: 5, icon: SemiTrailer5AxleIcon, description: 'Tractor + trailer' },
  { name: '6-axle trailers', code: '6T1', axles: 6, icon: SemiTrailer6AxleIcon, description: 'Tractor + trailer' },
  { name: '7-axle trailers', code: '7T1', axles: 7, icon: Trailer7AxleIcon, description: 'Tractor + trailer' },
  { name: '8-axle trailers', code: '8T1', axles: 8, icon: Trailer8AxleIcon, description: 'Tractor + trailer' },
  { name: '9-axle trailers', code: '9T1', axles: 9, icon: Trailer9AxleIcon, description: 'Tractor + trailer' },
  { name: '10-axle trailers', code: '10T', axles: 10, icon: Trailer10AxleIcon, description: 'Tractor + trailer' },
];

// Vehicle Classification Table Component for PDF
interface VehicleClassificationTableProps {
  className?: string;
}

export const VehicleClassificationTable: React.FC<VehicleClassificationTableProps> = ({ className = '' }) => (
  <div className={`${className}`} style={{ width: '100%' }}>
    <h3 className="text-lg font-bold text-gray-800 uppercase tracking-wider mb-4 pb-3 border-b-2 border-gray-400 text-center">
      Vehicle Classification Reference
    </h3>
    <div className="space-y-3">
      {vehicleClassifications.map((vehicle, index) => (
        <div 
          key={index} 
          className="flex items-center gap-4 p-3 bg-white rounded-lg border border-gray-300 shadow-sm"
          style={{ width: '100%' }}
        >
          <div className="flex-shrink-0" style={{ width: '120px' }}>
            <vehicle.icon className="text-gray-700" size={100} />
          </div>
          <div className="flex-1">
            <p className="text-base font-bold text-gray-900">{vehicle.name}</p>
            <p className="text-sm text-gray-600">{vehicle.code} • {vehicle.axles} axles</p>
            <p className="text-sm text-gray-500">{vehicle.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default VehicleClassificationTable;

