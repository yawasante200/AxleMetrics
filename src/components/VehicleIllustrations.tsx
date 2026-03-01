import React from 'react';

// Simplified schematic vehicle illustrations
// Monochrome line-drawing style matching engineering reference diagrams

interface VehicleIconProps {
  className?: string;
  size?: number;
}

// ── Helper: draw wheels at given positions ──
const Wheels: React.FC<{ positions: number[]; cy: number; r?: number }> = ({ positions, cy, r = 4 }) => (
  <>
    {positions.map((cx, i) => (
      <React.Fragment key={i}>
        <circle cx={cx} cy={cy} r={r} fill="#1f2937" stroke="#1f2937" strokeWidth="1" />
        <circle cx={cx} cy={cy} r={r * 0.4} fill="#9ca3af" />
      </React.Fragment>
    ))}
  </>
);

/**
 * Dynamically draws a compact vehicle schematic from an axle configuration string.
 * e.g. "1-2-2" → steering single + tandem + tandem (5 axles total)
 * Each group of axles is spaced apart; axles within a group are close together.
 */
export const ConfigurationDiagram: React.FC<{
  config: string;
  width?: number;
  height?: number;
}> = ({ config, width = 120, height = 28 }) => {
  const groups = config.split('-').map(n => parseInt(n, 10)).filter(n => !isNaN(n));
  if (groups.length === 0) return null;

  // Layout constants
  const wheelR = 2.5;
  const wheelY = height - wheelR - 1;
  const bodyTop = 3;
  const bodyBottom = wheelY - wheelR - 1;
  const margin = 6;
  const axleSpacing = 5;     // spacing between axles within a group
  const groupSpacing = 14;   // spacing between groups

  // Calculate wheel positions
  const wheelPositions: number[] = [];
  let x = margin;

  groups.forEach((count, gi) => {
    for (let a = 0; a < count; a++) {
      wheelPositions.push(x);
      if (a < count - 1) x += axleSpacing;
    }
    if (gi < groups.length - 1) x += groupSpacing;
  });

  const totalWidth = x + margin;
  const viewBox = `0 0 ${totalWidth} ${height}`;

  // First group is the cab, rest is the trailer body
  const firstGroupEnd = margin + (groups[0] - 1) * axleSpacing;
  const cabEnd = firstGroupEnd + 6;

  return (
    <svg
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      style={{ display: 'block' }}
    >
      {/* Cab shape */}
      <path
        d={`M${margin - 3} ${bodyBottom} L${margin - 3} ${bodyTop + 4} L${margin + 2} ${bodyTop + 4} L${margin + 5} ${bodyTop} L${cabEnd} ${bodyTop} L${cabEnd} ${bodyBottom} Z`}
        stroke="#1f2937"
        strokeWidth="1"
        fill="none"
      />
      {/* Trailer body (if more than 1 group) */}
      {groups.length > 1 && (
        <>
          <line x1={cabEnd} y1={(bodyTop + bodyBottom) / 2} x2={cabEnd + 3} y2={(bodyTop + bodyBottom) / 2} stroke="#1f2937" strokeWidth="1.5" />
          <rect
            x={cabEnd + 3}
            y={bodyTop}
            width={totalWidth - cabEnd - 3 - margin + 3}
            height={bodyBottom - bodyTop}
            stroke="#1f2937"
            strokeWidth="1"
            fill="none"
            rx="1"
          />
        </>
      )}
      {/* Wheels */}
      {wheelPositions.map((wx, i) => (
        <React.Fragment key={i}>
          <circle cx={wx} cy={wheelY} r={wheelR} fill="#1f2937" />
          <circle cx={wx} cy={wheelY} r={wheelR * 0.4} fill="#9ca3af" />
        </React.Fragment>
      ))}
      {/* Axle group brackets (small lines connecting grouped wheels) */}
      {(() => {
        let idx = 0;
        return groups.map((count, gi) => {
          const startIdx = idx;
          idx += count;
          if (count <= 1) return null;
          const x1 = wheelPositions[startIdx];
          const x2 = wheelPositions[startIdx + count - 1];
          return (
            <line
              key={`bracket-${gi}`}
              x1={x1}
              y1={wheelY - wheelR - 1}
              x2={x2}
              y2={wheelY - wheelR - 1}
              stroke="#6b7280"
              strokeWidth="0.5"
            />
          );
        });
      })()}
    </svg>
  );
};


// ── Passenger Car ── 2 axle
export const PassengerCarIcon: React.FC<VehicleIconProps> = ({ className = '', size = 60 }) => (
  <svg width={size} height={size * 0.5} viewBox="0 0 60 30" className={className} fill="none" strokeWidth="1.5">
    <path d="M8 18 L8 14 L14 14 L20 7 L40 7 L46 14 L52 14 L52 18 Z" fill="none" stroke="#1f2937" />
    <line x1="20" y1="7" x2="20" y2="14" stroke="#1f2937" strokeWidth="1" />
    <line x1="32" y1="7" x2="32" y2="14" stroke="#1f2937" strokeWidth="1" />
    <line x1="40" y1="7" x2="44" y2="14" stroke="#1f2937" strokeWidth="1" />
    <Wheels positions={[16, 46]} cy={22} r={4} />
  </svg>
);

// ── Small Bus ── 2 axle
export const SmallBusIcon: React.FC<VehicleIconProps> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 80 32" className={className} fill="none" strokeWidth="1.5">
    <rect x="8" y="6" width="64" height="16" rx="2" fill="none" stroke="#1f2937" />
    {[14, 26, 38, 50, 62].map((x, i) => (
      <rect key={i} x={x} y="9" width="7" height="7" rx="1" fill="none" stroke="#1f2937" strokeWidth="1" />
    ))}
    <Wheels positions={[20, 60]} cy={26} r={4} />
  </svg>
);

// ── Large Bus ── 3 axle
export const LargeBusIcon: React.FC<VehicleIconProps> = ({ className = '', size = 100 }) => (
  <svg width={size} height={size * 0.35} viewBox="0 0 100 35" className={className} fill="none" strokeWidth="1.5">
    <rect x="5" y="5" width="90" height="18" rx="2" fill="none" stroke="#1f2937" />
    {[10, 22, 34, 46, 58, 70, 82].map((x, i) => (
      <rect key={i} x={x} y="8" width="7" height="8" rx="1" fill="none" stroke="#1f2937" strokeWidth="1" />
    ))}
    <Wheels positions={[18, 72, 86]} cy={28} r={4} />
  </svg>
);

// ── Light Truck ── 2 axle pickup/van
export const LightTruckIcon: React.FC<VehicleIconProps> = ({ className = '', size = 70 }) => (
  <svg width={size} height={size * 0.45} viewBox="0 0 70 32" className={className} fill="none" strokeWidth="1.5">
    <path d="M5 18 L5 10 L18 10 L24 5 L34 5 L34 18 Z" fill="none" stroke="#1f2937" />
    <rect x="34" y="8" width="30" height="10" fill="none" stroke="#1f2937" />
    <Wheels positions={[15, 55]} cy={24} r={4} />
  </svg>
);

// ── Medium Truck ── 2 axle single unit
export const MediumTruckIcon: React.FC<VehicleIconProps> = ({ className = '', size = 80 }) => (
  <svg width={size} height={size * 0.4} viewBox="0 0 80 32" className={className} fill="none" strokeWidth="1.5">
    <path d="M5 20 L5 10 L15 10 L22 4 L28 4 L28 20 Z" fill="none" stroke="#1f2937" />
    <rect x="28" y="4" width="47" height="16" fill="none" stroke="#1f2937" />
    <Wheels positions={[18, 62]} cy={26} r={5} />
  </svg>
);

// ── Heavy Truck ── 3 axle single unit (rear tandem)
export const HeavyTruckIcon: React.FC<VehicleIconProps> = ({ className = '', size = 90 }) => (
  <svg width={size} height={size * 0.38} viewBox="0 0 90 34" className={className} fill="none" strokeWidth="1.5">
    <path d="M5 22 L5 10 L15 10 L22 4 L28 4 L28 22 Z" fill="none" stroke="#1f2937" />
    <rect x="28" y="4" width="57" height="18" fill="none" stroke="#1f2937" />
    <Wheels positions={[18, 67, 80]} cy={28} r={5} />
  </svg>
);

// ── Tractor helper (cab with windshield) ──
const TractorCab: React.FC<{ yBase?: number }> = ({ yBase = 22 }) => (
  <>
    <path d={`M3 ${yBase} L3 10 L12 10 L18 4 L24 4 L24 ${yBase} Z`} fill="none" stroke="#1f2937" strokeWidth="1.5" />
    <line x1="12" y1="10" x2="18" y2="4" stroke="#1f2937" strokeWidth="1" />
  </>
);

// ── 3-axle trailer ──
export const Trailer3AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 100 }) => (
  <svg width={size} height={size * 0.32} viewBox="0 0 100 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="68" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 32, 88]} cy={28} r={4} />
  </svg>
);

// ── 4-axle trailer ──
export const Trailer4AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 110 }) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 110 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="78" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 90, 102]} cy={28} r={4} />
  </svg>
);

// ── 5-axle trailer (Semi) ──
export const SemiTrailer5AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 120 }) => (
  <svg width={size} height={size * 0.3} viewBox="0 0 120 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="88" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 44, 100, 113]} cy={28} r={4} />
  </svg>
);

// ── 6-axle trailer ──
export const SemiTrailer6AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 130 }) => (
  <svg width={size} height={size * 0.28} viewBox="0 0 130 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="98" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 44, 95, 108, 121]} cy={28} r={4} />
  </svg>
);

// ── 7-axle trailer ──
export const Trailer7AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 140 }) => (
  <svg width={size} height={size * 0.26} viewBox="0 0 140 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="108" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 44, 90, 103, 116, 129]} cy={28} r={4} />
  </svg>
);

// ── 8-axle trailer ──
export const Trailer8AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 150 }) => (
  <svg width={size} height={size * 0.24} viewBox="0 0 150 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="118" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 44, 90, 103, 116, 129, 142]} cy={28} r={4} />
  </svg>
);

// ── 9-axle trailer ──
export const Trailer9AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 160 }) => (
  <svg width={size} height={size * 0.22} viewBox="0 0 160 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="128" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 44, 85, 98, 111, 124, 137, 150]} cy={28} r={4} />
  </svg>
);

// ── 10-axle trailer ──
export const Trailer10AxleIcon: React.FC<VehicleIconProps> = ({ className = '', size = 170 }) => (
  <svg width={size} height={size * 0.21} viewBox="0 0 170 32" className={className} fill="none" strokeWidth="1.5">
    <TractorCab />
    <rect x="28" y="4" width="138" height="18" fill="none" stroke="#1f2937" />
    <line x1="24" y1="16" x2="28" y2="16" stroke="#1f2937" strokeWidth="2" />
    <Wheels positions={[14, 30, 44, 80, 93, 106, 119, 132, 145, 158]} cy={28} r={4} />
  </svg>
);

// Vehicle classification lookup
export interface VehicleClassification {
  name: string;
  code: string;
  axles: number;
  icon: React.FC<VehicleIconProps>;
  description: string;
  /** Typical axle configurations (e.g. "1-2" = steering single + tandem rear) */
  configurations: string[];
}

export const vehicleClassifications: VehicleClassification[] = [
  { name: 'Passenger Car', code: 'PC', axles: 2, icon: PassengerCarIcon, description: '2 axles, 4 tires', configurations: ['1-1'] },
  { name: 'Small Buses', code: 'SB', axles: 2, icon: SmallBusIcon, description: '2 axles', configurations: ['1-1'] },
  { name: 'Medium Buses', code: 'MB', axles: 2, icon: SmallBusIcon, description: '2 axles', configurations: ['1-1'] },
  { name: 'Large Buses (2-axle)', code: 'LB2', axles: 2, icon: SmallBusIcon, description: '2 axles', configurations: ['1-1'] },
  { name: 'Large Buses (3-axle)', code: 'LB3', axles: 3, icon: LargeBusIcon, description: '3 axles', configurations: ['1-2'] },
  { name: 'Light Trucks', code: 'LT', axles: 2, icon: LightTruckIcon, description: '2 axles, pickup/van', configurations: ['1-1'] },
  { name: 'Medium Trucks', code: 'MT', axles: 2, icon: MediumTruckIcon, description: '2 axles', configurations: ['1-1'] },
  { name: 'Heavy Trucks', code: 'HT', axles: 3, icon: HeavyTruckIcon, description: '3+ axles', configurations: ['1-2'] },
  { name: '3-axle trailers', code: '3T', axles: 3, icon: Trailer3AxleIcon, description: 'Tractor + trailer', configurations: ['1-1-1', '1-2'] },
  { name: '4-axle trailers', code: '4T', axles: 4, icon: Trailer4AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-1', '1-1-2', '2-2'] },
  { name: '5-axle trailers', code: '5T', axles: 5, icon: SemiTrailer5AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-2', '1-1-3'] },
  { name: '6-axle trailers', code: '6T', axles: 6, icon: SemiTrailer6AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-3', '1-2-1-2', '1-1-2-2'] },
  { name: '7-axle trailers', code: '7T', axles: 7, icon: Trailer7AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-2-2', '1-2-4', '1-3-3'] },
  { name: '8-axle trailers', code: '8T', axles: 8, icon: Trailer8AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-2-3', '1-2-3-2', '2-2-2-2'] },
  { name: '9-axle trailers', code: '9T', axles: 9, icon: Trailer9AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-3-3', '1-2-2-4', '1-3-2-3'] },
  { name: '10-axle trailers', code: '10T', axles: 10, icon: Trailer10AxleIcon, description: 'Tractor + trailer', configurations: ['1-2-3-4', '1-3-3-3', '2-2-3-3'] },
];

// Vehicle Classification Table Component for PDF with Smart Pagination
interface VehicleClassificationTableProps {
  className?: string;
}

const VehicleClassificationTable: React.FC<VehicleClassificationTableProps> = ({ className = '' }) => {
  const vehicleRowStyle: React.CSSProperties = {
    width: '100%',
    minHeight: '45px',
    breakInside: 'avoid',
    pageBreakInside: 'avoid',
  };

  const iconContainerStyle: React.CSSProperties = {
    width: '85px',
    flexShrink: 0,
  };

  const textContainerStyle: React.CSSProperties = {
    flex: 1,
    minWidth: 0,
    wordBreak: 'break-word',
    overflowWrap: 'break-word',
    hyphens: 'auto',
    WebkitHyphens: 'auto',
    msHyphens: 'auto',
  };

  return (
    <div className={className}>
      <h3 className="text-base font-bold text-gray-800 uppercase tracking-wider mb-3 pb-2 border-b-2 border-gray-400 text-center">
        Vehicle Classification Reference
      </h3>
      <div className="space-y-2">
        {vehicleClassifications.map((vehicle, index) => (
          <div
            key={index}
            className="flex items-center gap-2 p-2 bg-white rounded-lg border border-gray-300 shadow-sm"
            style={vehicleRowStyle}
          >
            <div style={iconContainerStyle}>
              <vehicle.icon className="text-gray-700" size={70} />
            </div>
            <div style={textContainerStyle}>
              <p className="text-sm font-bold text-gray-900" style={{ margin: 0 }}>
                {vehicle.name}
              </p>
              <p className="text-xs text-gray-600" style={{ margin: 0 }}>
                {vehicle.code} • {vehicle.axles} axles
              </p>
              <p className="text-xs text-gray-500" style={{ margin: 0 }}>
                {vehicle.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export { VehicleClassificationTable };
export default VehicleClassificationTable;