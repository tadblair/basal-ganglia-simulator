import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity,
  Brain,
  Circle
} from 'lucide-react';

// --- Constants & Data ---

const COLORS = {
  touch: '#2563eb', // blue
  proprio: '#059669', // green
  pain: '#d97706', // amber
  background_line: '#f1f5f9',
};

const getColorShades = (color?: string) => {
  if (color === '#d97706' || color === 'amber') {
    return {
      light: '#fef3c7',  // Amber 100
      medium: '#fbbf24', // Amber 400
      dark: '#d97706'    // Amber 600
    };
  }
  if (color === 'blue') {
    return {
      light: '#dbeafe',  // Blue 100
      medium: '#60a5fa', // Blue 400
      dark: '#2563eb'    // Blue 600
    };
  }
  if (color === 'black') {
    return {
      light: '#e5e7eb',  // Gray 200
      medium: '#9ca3af', // Gray 400
      dark: '#1f2937'    // Gray 800
    };
  }
  return {
    light: '#f1f5f9',
    medium: '#cbd5e1', // Slate 300
    dark: '#475569'    // Slate 600
  };
};

const LIMBS = [];

const NODES = {
  // Brain Nodes (Left - Amber)
  Cx_Leg_L: { x: 298, y: 124, label: 'M1', labelPos: 'top' as const, color: '#d97706' },
  VTN_L: { x: 415, y: 392, label: 'VTN', labelPos: 'left' as const, color: '#d97706' },
  D2_L: { x: 233, y: 518, label: 'D2', labelPos: 'top' as const, color: '#d97706' },
  D1_L: { x: 267, y: 594, label: 'D1', labelPos: 'top' as const, color: '#d97706' },
  GPE_L: { x: 310, y: 518, label: 'GPE', labelPos: 'top' as const, color: '#d97706' },
  STN_L: { x: 375, y: 520, label: 'STN', labelPos: 'top' as const, color: '#d97706' },
  GPI_L: { x: 402, y: 573, label: 'GPI', labelPos: 'bottom' as const, color: '#d97706' },
  SNpc_L: { x: 262, y: 684, label: 'SNpc', labelPos: 'bottom' as const, color: 'black' },

  // Brain Nodes (Right - Blue)
  Cx_Leg_R: { x: 702, y: 124, label: 'M1', labelPos: 'top' as const, color: 'blue' },
  VTN_R: { x: 585, y: 392, label: 'VTN', labelPos: 'right' as const, color: 'blue' },
  D2_R: { x: 767, y: 518, label: 'D2', labelPos: 'top' as const, color: 'blue' },
  D1_R: { x: 733, y: 594, label: 'D1', labelPos: 'top' as const, color: 'blue' },
  GPE_R: { x: 690, y: 518, label: 'GPE', labelPos: 'top' as const, color: 'blue' },
  STN_R: { x: 625, y: 520, label: 'STN', labelPos: 'top' as const, color: 'blue' },
  GPI_R: { x: 598, y: 573, label: 'GPI', labelPos: 'bottom' as const, color: 'blue' },
  SNpc_R: { x: 738, y: 684, label: 'SNpc', labelPos: 'bottom' as const, color: 'black' },

  // Ventral Horn Nodes (L/R)
  VHORN_LumL: { x: 342, y: 800, label: 'FLEX MN', labelPos: 'left' as const },
  VHORN_LumR: { x: 658, y: 800, label: 'EXTEND MN', labelPos: 'right' as const },
  
  // Local Muscle Targets
  MuscleLL: { x: 168, y: 854, label: 'MUSCLE', labelPos: 'top' as const },
  MuscleRL: { x: 832, y: 854, label: 'MUSCLE', labelPos: 'top' as const },
};

const CONNECTIONS = [
  // Left (Amber) Circuit
  { from: 'Cx_Leg_L', to: 'VTN_L', type: 'excitatory', color: '#d97706' },
  { from: 'VTN_L', to: 'Cx_Leg_L', type: 'excitatory', color: '#d97706' },
  { from: 'D1_L', to: 'GPI_L', type: 'inhibitory', color: '#d97706' },
  { from: 'D2_L', to: 'GPE_L', type: 'inhibitory', color: '#d97706' },
  { from: 'GPE_L', to: 'STN_L', type: 'inhibitory', color: '#d97706' },
  { from: 'STN_L', to: 'GPI_L', type: 'excitatory', color: '#d97706' },
  { from: 'GPI_L', to: 'VTN_L', type: 'inhibitory', color: '#d97706' },
  { from: 'SNpc_L', to: 'D1_L', type: 'excitatory', color: 'black' },
  { from: 'SNpc_L', to: 'D2_L', type: 'inhibitory', color: 'black' },
  
  // Right (Blue) Circuit
  { from: 'Cx_Leg_R', to: 'VTN_R', type: 'excitatory', color: 'blue' },
  { from: 'VTN_R', to: 'Cx_Leg_R', type: 'excitatory', color: 'blue' },
  { from: 'D1_R', to: 'GPI_R', type: 'inhibitory', color: 'blue' },
  { from: 'D2_R', to: 'GPE_R', type: 'inhibitory', color: 'blue' },
  { from: 'GPE_R', to: 'STN_R', type: 'inhibitory', color: 'blue' },
  { from: 'STN_R', to: 'GPI_R', type: 'excitatory', color: 'blue' },
  { from: 'GPI_R', to: 'VTN_R', type: 'inhibitory', color: 'blue' },
  { from: 'SNpc_R', to: 'D1_R', type: 'excitatory', color: 'black' },
  { from: 'SNpc_R', to: 'D2_R', type: 'inhibitory', color: 'black' },

  // Output to VH (Decussating branches from Cortex)  
  { from: 'Cx_Leg_L', to: 'VHORN_LumR', type: 'excitatory', color: '#d97706' },
  { from: 'Cx_Leg_R', to: 'VHORN_LumL', type: 'excitatory', color: 'blue' },

  // From VH to Muscle
  { from: 'VHORN_LumL', to: 'MuscleLL', type: 'excitatory', color: 'blue' },
  { from: 'VHORN_LumR', to: 'MuscleRL', type: 'excitatory', color: '#d97706' },
];

const getBrainOutline = (side: 'left' | 'right') => {
  const isLeft = side === 'left';
  const color = isLeft ? '#fef3c7' : '#5eb3d1'; // Amber-100 for dull light yellow
  const mirror = (x: number) => isLeft ? x : 1000 - x;

  // Approximate contour of the homunculus cortex from the PNG
  const path = `
    M ${mirror(500)} 20
    C ${mirror(400)} 20, ${mirror(350)} 40, ${mirror(350)} 80
    C ${mirror(350)} 120, ${mirror(300)} 120, ${mirror(280)} 140
    C ${mirror(250)} 170, ${mirror(200)} 180, ${mirror(180)} 220
    C ${mirror(150)} 260, ${mirror(120)} 300, ${mirror(120)} 350
    C ${mirror(120)} 400, ${mirror(180)} 450, ${mirror(250)} 420
    C ${mirror(300)} 400, ${mirror(350)} 380, ${mirror(380)} 350
    C ${mirror(420)} 320, ${mirror(450)} 250, ${mirror(460)} 150
    L ${mirror(500)} 150
    Z
  `.replace(/\s+/g, ' ').trim();

  return <path d={path} fill={color} fillOpacity="0.3" stroke={color} strokeWidth="2" />;
};

interface ConnectionProps {
  from: string;
  to: string;
  type: string;
  color: string;
  dopamine: 'none' | 'low' | 'high';
  lesion: string | null;
  transientSpikes?: any[];
}

const Connection: React.FC<ConnectionProps> = ({ from, to, type, color, dopamine, lesion, transientSpikes }) => {
  const start = (NODES as any)[from];
  const end = (NODES as any)[to];
  if (!start || !end) return null;

  const isExcitatory = type === 'excitatory';
  const colorName = color === '#d97706' ? 'amber' : color;
  const markerId = isExcitatory ? `arrow-${colorName}` : `bar-${colorName}`;

  // Simple curve for connections
  const midX = (start.x + end.x) / 2;
  const midY = (start.y + end.y) / 2;
  
  const targetOffset = type === 'excitatory' ? 12 : 21;

  // Generic target offset logic for curves
  const getTarget = (controlX: number, controlY: number) => {
    const dx = end.x - controlX;
    const dy = end.y - controlY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    return {
      x: end.x - (dx / dist) * targetOffset,
      y: end.y - (dy / dist) * targetOffset
    };
  };

  let pathData = '';

  if (from.startsWith('Cx_Leg')) {
    const isLeft = from.endsWith('_L');
    const side = isLeft ? '_L' : '_R';
    const vtnEnd = (NODES as any)[`VTN${side}`];
    
    // Original bow logic to find peak
    const vtnMidX = (start.x + vtnEnd.x) / 2;
    const vtnMidY = (start.y + vtnEnd.y) / 2;
    const vtnControlX = vtnMidX + (isLeft ? 210 : -210);
    const vtnControlY = vtnMidY - 20;

    // Medial peak calculation (t=0.5 on quadratic Bezier)
    const peakX = 0.25 * start.x + 0.5 * vtnControlX + 0.25 * vtnEnd.x;
    const peakY = 0.25 * start.y + 0.5 * vtnControlY + 0.25 * vtnEnd.y;

    if (to.includes('VTN')) {
      const t = getTarget(vtnControlX, vtnControlY);
      pathData = `M ${start.x} ${start.y} Q ${vtnControlX} ${vtnControlY} ${t.x} ${t.y}`;
    } else if (to.includes('VHORN')) {
      const snpcY = (NODES as any).SNpc_L.y;
      // Use a control point specifically for the VH branch to position the drop point laterally without affecting the main bowed axon (the VTN connection)
      const vtnControlX_VH = vtnMidX + (isLeft ? 218 : -218);
      // Adjusted tVal to move the drop point laterally (away from midline)
      const tVal = 0.61;
      const bx = Math.pow(1 - tVal, 2) * start.x + 2 * (1 - tVal) * tVal * vtnControlX_VH + Math.pow(tVal, 2) * vtnEnd.x;
      const by = Math.pow(1 - tVal, 2) * start.y + 2 * (1 - tVal) * tVal * vtnControlY + Math.pow(tVal, 2) * vtnEnd.y;
      
      const t = getTarget(bx, snpcY);
      // Path starts on its deeper bow trajectory and drops vertically
      pathData = `M ${bx} ${by} L ${bx} ${snpcY} L ${t.x} ${t.y}`;
    }
  } else if (from.startsWith('SNpc')) {
    const tx = end.x;
    const ty = end.y + targetOffset;
    pathData = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${tx} ${ty}`;
  } else if (from.includes('VTN') && to.includes('Cx_Leg')) {
    const isLeft = from.endsWith('_L');
    const lateralShift = isLeft ? -30 : 30;
    const cx = midX + lateralShift;
    const cy = midY;
    const t = getTarget(cx, cy);
    pathData = `M ${start.x} ${start.y} Q ${cx} ${cy} ${t.x} ${t.y}`;
  } else {
    const cx = midX + (from.startsWith('Cx') ? 20 : 0);
    const cy = midY;
    const t = getTarget(cx, cy);
    pathData = `M ${start.x} ${start.y} Q ${cx} ${cy} ${t.x} ${t.y}`;
  }

  const isGpiToVtn = from.includes('GPI') && to.includes('VTN');
  const isStnToGpi = from.includes('STN') && to.includes('GPI');
  const isD2ToGpe = from.includes('D2') && to.includes('GPE');
  const isSnpcToD1 = from.includes('SNpc') && to.includes('D1');
  const isSnpcToD2 = from.includes('SNpc') && to.includes('D2');
  const isD1ToGpi = from.includes('D1') && to.includes('GPI');
  const isGpeToStn = from.includes('GPE') && to.includes('STN');
  const isGpeToGpi = from.includes('GPE') && to.includes('GPI');
  const isCxToVtn = from.includes('Cx_Leg') && to.includes('VTN');
  const isVtnToCx = from.includes('VTN') && to.includes('Cx_Leg');
  const isCxToVH = from.includes('Cx_Leg') && to.includes('VHORN');
  const isVhToMuscle = from.includes('VHORN') && to.includes('Muscle');

  let hasSpikes = false;
  let spikeDuration = 1.0;
  let spikeInterval = 0.25;
  let delayOffset = 0;

  const BRANCH_T = 0.61;
  const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
  const refVelocity = 292 / 4.8;

  if (dopamine === 'none') {
    hasSpikes = isGpiToVtn || isStnToGpi || isD2ToGpe || isCxToVtn || isCxToVH || isVhToMuscle;
    
    // General lesion effect: any lesioned node stops firing spikes
    if (lesion && from.toLowerCase().includes(lesion.toLowerCase())) {
      hasSpikes = false;
    }

    // STN or D2 Lesion specific effect: GPi reduces rate to Normal level
    if ((lesion === 'stn' || lesion === 'd2') && from.includes('GPI') && to.includes('VTN') && dopamine === 'none') {
      hasSpikes = true; // GPi still fires, but slower
      spikeInterval = 1.2; 
    }

    // D2 Lesion specific effect: GPe fires at low rate
    if (lesion === 'd2' && from.includes('GPE') && dopamine === 'none') {
      hasSpikes = true;
      spikeInterval = 1.2;
    }

    // D2 Lesion specific effect: STN reduces rate
    if (lesion === 'd2' && from.includes('STN') && dopamine === 'none') {
      hasSpikes = true;
      spikeInterval = 0.6;
    }

    if (isCxToVtn || isCxToVH || isVhToMuscle) {
      spikeInterval = 9.6;
      const baseDuration = 4.8;
      if (isCxToVH) {
        spikeDuration = 500 / refVelocity; 
        delayOffset = baseDuration * BRANCH_T;
      } else if (isVhToMuscle) {
        spikeDuration = dist / refVelocity;
        delayOffset = baseDuration;
      } else {
        spikeDuration = baseDuration;
      }
    } else {
      spikeDuration = dist / refVelocity;
      if (!spikeInterval || spikeInterval === 0.25) {
        spikeInterval = (from.includes('GPI') || from.includes('D2')) ? 0.6 : 0.3;
      }
    }
  } else if (dopamine === 'low') {
    hasSpikes = isGpiToVtn || isStnToGpi || isD2ToGpe || isSnpcToD1 || isSnpcToD2 || isD1ToGpi || isGpeToStn || isGpeToGpi || isCxToVtn || isCxToVH || isVhToMuscle;
    
    if (isCxToVtn || isCxToVH || isVhToMuscle) {
      spikeInterval = 9.6;
      const baseDuration = 4.8;
      if (isCxToVH) {
        spikeDuration = 500 / refVelocity; 
        delayOffset = baseDuration * BRANCH_T;
      } else if (isVhToMuscle) {
        spikeDuration = dist / refVelocity;
        delayOffset = baseDuration;
      } else {
        spikeDuration = baseDuration;
      }
    } else {
      spikeDuration = dist / refVelocity;
      if (from.includes('STN')) {
        spikeInterval = 0.6; // half as fast as none (0.3)
      } else if (from.includes('GPI') || from.includes('D2') || from.includes('GPE')) {
        spikeInterval = 1.2; // half as fast as none (0.6)
      } else if (from.includes('SNpc') || from.includes('D1')) {
        spikeInterval = 1.0; // sync with pulse rate (1.0)
      } else {
        spikeInterval = 0.3;
      }
    }
  } else if (dopamine === 'high') {
    hasSpikes = isSnpcToD1 || isSnpcToD2 || isD1ToGpi || isGpeToStn || isGpeToGpi || isCxToVtn || isVtnToCx || isCxToVH || isVhToMuscle;
    
    if (isCxToVtn || isVtnToCx || isCxToVH || isVhToMuscle) {
      spikeInterval = 1.6;
      const baseDuration = 4.8;
      if (isCxToVH) {
        spikeDuration = 500 / refVelocity;
        delayOffset = baseDuration * BRANCH_T;
      } else if (isVhToMuscle) {
        spikeDuration = dist / refVelocity;
        delayOffset = baseDuration;
      } else {
        spikeDuration = baseDuration;
      }
    } else {
      spikeDuration = dist / refVelocity;
      // High frequency spikes
      // Half rate for SNpc and GPe (0.15 -> 0.3)
      if (from.includes('SNpc') || from.includes('GPE')) {
        spikeInterval = 0.3;
      } else {
        spikeInterval = (from.includes('GPI') || from.includes('D2')) ? 0.3 : 0.15;
      }
    }
  }

  // Calculate number of spikes and repeat settings for seamless stream
  const numSpikes = Math.max(1, Math.ceil(spikeDuration / spikeInterval));
  const totalRepeatTime = numSpikes * spikeInterval;
  const repeatDelay = totalRepeatTime - spikeDuration;

  return (
    <g>
      <path d={pathData} fill="none" stroke={color} strokeWidth="2" markerEnd={`url(#${markerId})`} />
      {hasSpikes && (
        <>
          {Array.from({ length: numSpikes }).map((_, i) => (
            <motion.circle
              key={`${i}-${dopamine}`}
              r="3.5"
              fill={color}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: spikeDuration,
                repeat: Infinity,
                repeatDelay: repeatDelay,
                ease: "linear",
                delay: i * spikeInterval + delayOffset,
              }}
              style={{ 
                offsetPath: `path("${pathData}")`,
              }}
            />
          ))}
        </>
      )}
      {transientSpikes && transientSpikes.map(ts => (
        <React.Fragment key={ts.id}>
          {Array.from({ length: ts.count }).map((_, i) => (
            <motion.circle
              key={`${ts.id}-${i}`}
              r="4"
              fill={ts.color}
              initial={{ offsetDistance: "0%" }}
              animate={{ offsetDistance: "100%" }}
              transition={{
                duration: ts.duration,
                repeat: 0,
                ease: "linear",
                delay: ts.delaySec + i * 0.15,
              }}
              style={{ 
                offsetPath: `path("${pathData}")`,
              }}
            />
          ))}
        </React.Fragment>
      ))}
    </g>
  );
};

const p = (...pts: {x: number, y: number}[]) => {
  if (pts.length === 0) return '';
  return `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(pt => `L ${pt.x} ${pt.y}`).join(' ');
};

// Simplified path generator (no injury logic)
const getPathPoints = (pathId: string): { x: number; y: number }[] => {
  return [];
};

const ALL_PATHS: string[] = [];

export default function App() {
  const [dopamine, setDopamine] = React.useState<'none' | 'low' | 'high'>('low');
  const [lesion, setLesion] = React.useState<string | null>(null);
  const dopamineRef = React.useRef(dopamine);
  const lesionRef = React.useRef(lesion);
  const [transientSpikes, setTransientSpikes] = React.useState<any[]>([]);
  const [pulseCounters, setPulseCounters] = React.useState<Record<string, number>>({});
  const nextSpikeId = React.useRef(0);

  // Keep refs in sync
  React.useEffect(() => {
    dopamineRef.current = dopamine;
  }, [dopamine]);

  React.useEffect(() => {
    lesionRef.current = lesion;
  }, [lesion]);

  // Reset circuit dynamics on mode change
  React.useEffect(() => {
    setTransientSpikes([]);
  }, [dopamine, lesion]);

  const handleArrival = React.useCallback((neuronId: string, fromId: string, count: number) => {
    let currentDopamine = dopamineRef.current;
    const currentLesion = lesionRef.current;
    
    // STN or D2 Lesion in None mode acts like Normal mode for circuit dynamics
    if (currentDopamine === 'none' && (currentLesion === 'stn' || currentLesion === 'd2')) {
      currentDopamine = 'low';
    }

    // GPI Lesion in None mode acts like High mode for circuit dynamics
    if (currentDopamine === 'none' && currentLesion === 'gpi') {
      currentDopamine = 'high';
    }

    // Visually pulse the neuron
    setPulseCounters(prev => ({ ...prev, [neuronId]: (prev[neuronId] || 0) + 1 }));

    // Rule-based propagation for movement command pulses
    if (neuronId.includes('VTN')) {
      if (currentDopamine === 'none') {
        // Absorbed, do nothing
      } else if (currentDopamine === 'low') {
        // produce 3 spikes out for 3 spikes in (1:1 ratio)
        const feedbackDest = fromId; // Should be the leg cortex
        triggerSpikeStream(neuronId, feedbackDest, count, 0.1);
      } else if (currentDopamine === 'high') {
        // produce twice as many spikes as the input burst (2:1 ratio)
        const feedbackDest = fromId;
        triggerSpikeStream(neuronId, feedbackDest, count * 2, 0.1);
      }
    } else if (neuronId.includes('VHORN')) {
      // MNs send spike to muscle
      const muscleId = neuronId === 'VHORN_LumL' ? 'MuscleLL' : 'MuscleRL';
      triggerSpikeStream(neuronId, muscleId, 1, 0.1);
    } else if (neuronId.includes('Cx_Leg')) {
      // Feedback spikes reach the leg cortex
      // In low mode, we preserve the count to sustain a stable loop (usually 3 spikes)
      // In high mode, we cap the output to avoid exponential explosion since VTN has a 2x gain
      const outputCount = currentDopamine === 'high' ? Math.min(count, 3) : count;
      
      triggerSpikeStream(neuronId, neuronId.replace('Cx_Leg', 'VTN'), outputCount, 0.1);
      triggerSpikeStream(neuronId, neuronId === 'Cx_Leg_L' ? 'VHORN_LumR' : 'VHORN_LumL', outputCount, 0.1);
    }
  }, []); // Remove dependencies since we use refs

  const triggerSpikeStream = React.useCallback((from: string, to: string, count: number, delaySec: number = 0) => {
    const connection = CONNECTIONS.find(c => c.from === from && c.to === to);
    if (!connection) return;

    const id = nextSpikeId.current++;
    const start = (NODES as any)[from];
    const end = (NODES as any)[to];
    const dist = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
    const refVelocity = 292 / 4.8;

    let duration = dist / refVelocity;
    // Special path for Cx to VH
    if (from.startsWith('Cx_Leg') && to.startsWith('VHORN')) {
      duration = 500 / refVelocity;
    }

    setTransientSpikes(prev => [...prev, { id, from, to, count, duration, delaySec, color: connection.color }]);

    // Arrival logic
    setTimeout(() => {
      handleArrival(to, from, count);
    }, (duration + delaySec) * 1000);

    // Cleanup
    setTimeout(() => {
      setTransientSpikes(prev => prev.filter(s => s.id !== id));
    }, (duration + delaySec + count * 0.5 + 1) * 1000);
  }, [handleArrival]);

  const triggerMovement = () => {
    // 3 action potentials from leg neurons
    triggerSpikeStream('Cx_Leg_L', 'VTN_L', 3);
    
    // Delay = 2/3 * travel time (4.8s)
    const vhDelay = 4.8 * (2 / 3);
    triggerSpikeStream('Cx_Leg_L', 'VHORN_LumR', 3, vhDelay);
    
    triggerSpikeStream('Cx_Leg_R', 'VTN_R', 3);
    triggerSpikeStream('Cx_Leg_R', 'VHORN_LumL', 3, vhDelay);
    
    // Visually pulse the cortex neurons
    setPulseCounters(prev => ({ 
      ...prev, 
      'Cx_Leg_L': (prev['Cx_Leg_L'] || 0) + 1,
      'Cx_Leg_R': (prev['Cx_Leg_R'] || 0) + 1 
    }));
  };

  return (
    <div className="w-full h-screen bg-slate-50 text-slate-900 flex font-sans overflow-hidden">
      
      {/* Legend Sidebar */}
      <aside className="w-72 bg-white border-r border-slate-200 p-6 flex flex-col gap-6 shadow-sm z-20">
        <header className="flex flex-col">
          <div className="flex items-center gap-2 text-blue-600 mb-1">
            <Activity className="w-5 h-5" />
            <h1 className="text-xl font-bold text-slate-800 leading-tight uppercase tracking-wider">Basal Ganglia<br/>Circuit</h1>
          </div>
          <div className="h-1 w-12 bg-blue-600 rounded-full"></div>
        </header>

        {/* Dopamine Control */}
        <div className="space-y-4 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">SNpc FIRING RATE</p>
          <div className="flex flex-col gap-3">
            {(['none', 'low', 'high'] as const).map((level) => (
              <label key={level} className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center">
                  <input
                    type="radio"
                    name="dopamine"
                    value={level}
                    checked={dopamine === level}
                    onChange={(e) => setDopamine(e.target.value as any)}
                    className="peer appearance-none w-5 h-5 border-2 border-slate-300 rounded-full checked:border-blue-600 transition-all cursor-pointer"
                  />
                  <div className="absolute w-2.5 h-2.5 rounded-full bg-blue-600 scale-0 peer-checked:scale-100 transition-transform" />
                </div>
                <span className={`text-sm font-semibold capitalize transition-colors ${
                  dopamine === level ? 'text-blue-600' : 'text-slate-600 group-hover:text-slate-900'
                }`}>
                  {level === 'low' ? 'Normal' : level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Movement Command */}
        <div className="space-y-4 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Movement Command</p>
          <button 
            onClick={triggerMovement}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-600 text-white rounded-lg font-bold hover:bg-orange-700 transition-colors shadow-md active:scale-95 flex items-center gap-2"
          >
            <Activity className="w-5 h-5" />
            M1 BURST
          </button>
        </div>

        {/* Lesion Control */}
        <div className="space-y-4 py-4 border-b border-slate-100">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Lesion</p>
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: 'stn', label: 'stn' },
              { id: 'gpi', label: 'gpi' },
              { id: 'gpe', label: 'gpe' },
              { id: 'd2', label: 'd2' },
              { id: 'd1', label: 'd1' },
              { id: 'snpc', label: 'snpc' }
            ].map((node) => {
              const isDisabled = dopamine !== 'none';
              return (
                <label 
                  key={node.id} 
                  className={`flex items-center gap-2 cursor-pointer group ${isDisabled ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <div className="relative flex items-center justify-center shrink-0">
                    <input
                      type="radio"
                      name="lesion"
                      value={node.id}
                      disabled={isDisabled}
                      checked={lesion === node.id}
                      onChange={() => setLesion(lesion === node.id ? null : node.id)}
                      onClick={(e) => {
                        if (isDisabled) return;
                        // Allow deselecting the radio button
                        if (lesion === node.id) {
                          setLesion(null);
                        }
                      }}
                      className="appearance-none w-4 h-4 border-2 border-slate-300 rounded-full checked:border-red-600 transition-all cursor-pointer disabled:cursor-not-allowed"
                    />
                    <div className="absolute w-2 h-2 rounded-full bg-red-600 scale-0 peer-checked:scale-100 transition-transform" />
                    {lesion === node.id && <div className="absolute w-2 h-2 rounded-full bg-red-600" />}
                  </div>
                  <span className={`text-xs font-bold uppercase transition-colors ${
                    lesion === node.id ? 'text-red-600' : isDisabled ? 'text-slate-300' : 'text-slate-500 group-hover:text-slate-900'
                  }`}>
                    {node.label}
                  </span>
                </label>
              );
            })}
          </div>
          {lesion && (
            <button 
              onClick={() => setLesion(null)}
              className="text-[10px] text-slate-400 hover:text-slate-600 uppercase font-bold tracking-tighter"
            >
              Clear Lesion
            </button>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Pathway Legend</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <span className="text-sm font-medium text-slate-700">Left Hemisphere</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm font-medium text-slate-700">Right Hemisphere</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-black" />
              <span className="text-sm font-medium text-slate-700">Nigrostriatal (DA)</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-slate-100">
          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            This diagram visualizes the basal ganglia motor circuits, showing the direct and indirect pathways and their influence on spinal motor neurons.
          </p>
        </div>
      </aside>

      {/* Diagram Stage */}
      <main className="flex-1 relative bg-white flex items-center justify-center p-10 overflow-hidden">
        <div className="w-full h-full max-w-[900px] max-h-[900px] border border-slate-100 rounded-2xl relative bg-white shadow-inner overflow-hidden">
          <svg viewBox="0 0 1000 1000" className="w-full h-full">
            <defs>
              <marker id="arrow-amber" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10.5" markerHeight="10.5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
              </marker>
              <marker id="arrow-red" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10.5" markerHeight="10.5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#d97706" />
              </marker>
              <marker id="arrow-blue" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10.5" markerHeight="10.5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="#2563eb" />
              </marker>
              <marker id="arrow-black" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="10.5" markerHeight="10.5" orient="auto-start-reverse">
                <path d="M 0 0 L 10 5 L 0 10 z" fill="black" />
              </marker>
              <marker id="bar-amber" viewBox="0 0 10 20" refX="5" refY="10" markerWidth="6" markerHeight="12" orient="auto-start-reverse">
                <path d="M 5 0 L 5 20" stroke="#d97706" strokeWidth="9" />
              </marker>
              <marker id="bar-blue" viewBox="0 0 10 20" refX="5" refY="10" markerWidth="6" markerHeight="12" orient="auto-start-reverse">
                <path d="M 5 0 L 5 20" stroke="#2563eb" strokeWidth="9" />
              </marker>
              <marker id="bar-black" viewBox="0 0 10 20" refX="5" refY="10" markerWidth="6" markerHeight="12" orient="auto-start-reverse">
                <path d="M 5 0 L 5 20" stroke="black" strokeWidth="9" />
              </marker>
            </defs>

            {/* Brain Regions */}
            {getBrainOutline('left')}
            {getBrainOutline('right')}

            {/* Labels */}
            <text x="250" y="50" textAnchor="middle" className="fill-slate-200 text-[40px] font-black uppercase tracking-[0.2em]">LEFT BRAIN</text>
            <text x="750" y="50" textAnchor="middle" className="fill-slate-200 text-[40px] font-black uppercase tracking-[0.2em]">RIGHT BRAIN</text>

            {/* Background Paths */}
            <g opacity="0.3">
              {ALL_PATHS.map(pathId => {
                const type = pathId.split('-')[2];
                let color = '#94a3b8';
                if (type.startsWith('touch')) color = COLORS.touch;
                else if (type.startsWith('prop') || type === 'stretch' || type === 'spinocerebellar') color = COLORS.proprio;
                else if (type.startsWith('pain') || type === 'withdrawal') color = COLORS.pain;
                
                return (
                  <path 
                    key={pathId} 
                    d={p(...getPathPoints(pathId))} 
                    fill="none" 
                    stroke={color} 
                    strokeWidth="1.5" 
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                );
              })}
            </g>

            {/* Spinal Cord Section Ellipses */}
            {[
              { y: 835, label: 'L4' }
            ].map(section => (
              <g key={section.label}>
                <ellipse cx="500" cy={section.y} rx="225" ry="72" fill="none" stroke="#cbd5e1" strokeWidth="1.5" />
              </g>
            ))}

            {/* Anatomical Nodes */}
            {Object.entries(NODES).map(([id, pos]) => {
              const nodeColor = (pos as any).color;
              const shades = getColorShades(nodeColor);
              const isLesioned = lesion && id.toLowerCase().includes(lesion.toLowerCase());

              return (
                <g key={id}>
                  {id.startsWith('Muscle') && (
                    <g opacity="0.4">
                      {[-6, -2, 2, 6].map((dy, i) => (
                        <line 
                          key={i}
                          x1={pos.x - 20} 
                          y1={pos.y + dy} 
                          x2={pos.x + 20} 
                          y2={pos.y + dy} 
                          stroke="#d97706" 
                          strokeWidth="1.5" 
                        />
                      ))}
                    </g>
                  )}
                  <motion.circle 
                    key={`${id}-${dopamine}-${pulseCounters[id] || 0}`}
                    cx={pos.x} 
                    cy={pos.y} 
                    r="12" 
                    fill={isLesioned ? '#cbd5e1' : shades.medium}
                    stroke={isLesioned ? '#94a3b8' : '#475569'}
                    strokeWidth="2.5"
                    opacity={isLesioned ? 0.6 : 1}
                    {...(() => {
                      if (isLesioned) return {};
                      const basalRate = 0.3;
                      const slowRate = 1.0;
                      const cxSlowRate = 9.6;
                      const transitionDurationNormal = 0.2;
                      
                      let pulseType: 'enlarge' | 'shrink' | null = null;
                      let duration = basalRate;

                      if (dopamine === 'none') {
                        if (id.includes('GPI') || id.includes('STN') || id.includes('D2')) {
                          pulseType = 'enlarge';
                          duration = (id.includes('GPI') || id.includes('D2')) ? basalRate * 2 : basalRate;
                          
                          if ((lesion === 'stn' || lesion === 'd2') && id.includes('GPI')) {
                            duration = 1.2; // Normal rate
                          }
                          if (lesion === 'd2' && id.includes('STN')) {
                            duration = 0.6; // Normal rate
                          }
                        }
                        if (id.includes('VTN') || id.includes('GPE')) {
                          // VTN stops spontaneous shrinking if D2, STN, or GPI is lesioned
                          if (id.includes('VTN') && (lesion === 'stn' || lesion === 'gpi' || lesion === 'd2')) {
                            if (lesion === 'gpi') {
                              pulseType = 'enlarge';
                              duration = cxSlowRate; // Driven by slow M1 rate in None mode
                            } else {
                              pulseType = null;
                            }
                          } else if (id.includes('GPE') && lesion === 'd2') {
                            // GPe fires at low rate
                            pulseType = 'enlarge';
                            duration = 1.2;
                          } else {
                            pulseType = 'shrink';
                            duration = 0.6;
                          }
                        }
                        if (id.includes('Cx_Leg') || id.includes('VH')) {
                          pulseType = 'enlarge';
                          duration = cxSlowRate;
                        }
                      } else if (dopamine === 'low') {
                        if (id.includes('SNpc') || id.includes('D1')) {
                          pulseType = 'enlarge';
                          duration = slowRate;
                        }
                        if (id.includes('Cx_Leg') || id.includes('VH')) {
                          pulseType = 'enlarge';
                          duration = cxSlowRate;
                        }
                        if (id.includes('STN')) {
                          pulseType = 'enlarge';
                          duration = 0.6;
                        }
                        if (id.includes('GPI') || id.includes('D2')) {
                          pulseType = 'enlarge';
                          duration = 1.2;
                        }
                        if (id.includes('GPE')) {
                          pulseType = 'shrink';
                          duration = 1.2;
                        }
                        // VTN is non-spontaneous in low mode
                      } else if (dopamine === 'high') {
                        if (id.includes('SNpc') || id.includes('D1')) {
                          pulseType = 'enlarge';
                          duration = 0.3;
                        }
                        if (id.includes('Cx_Leg') || id.includes('VH')) {
                          pulseType = 'enlarge';
                          duration = 1.6;
                        }
                        if (id.includes('GPE')) {
                          pulseType = 'enlarge';
                          duration = 0.3;
                        }
                        if (id.includes('STN')) {
                          pulseType = 'shrink';
                          duration = 0.3;
                        }
                        if (id.includes('VTN')) {
                          pulseType = 'enlarge';
                          duration = 1.6;
                        }
                      }

                      const isSpontaneous = pulseType !== null;
                      
                      return {
                        animate: pulseType === 'shrink' 
                          ? { scale: [1, 0.6, 1], fill: [shades.medium, shades.light, shades.medium] }
                          : { scale: [1, 1.2, 1], fill: [shades.medium, shades.dark, shades.medium] },
                        transition: { 
                          duration: isSpontaneous ? duration : transitionDurationNormal, 
                          repeat: isSpontaneous ? Infinity : 0, 
                          ease: "easeOut" 
                        }
                      };
                    })()}
                  />

                  {isLesioned && (
                    <g stroke="red" strokeWidth="3" strokeLinecap="round">
                      <line x1={pos.x - 8} y1={pos.y - 8} x2={pos.x + 8} y2={pos.y + 8} />
                      <line x1={pos.x + 8} y1={pos.y - 8} x2={pos.x - 8} y2={pos.y + 8} />
                    </g>
                  )}
                  
                  {pos.label && (
                    <text 
                      x={pos.labelPos === 'left' ? pos.x - 24 : pos.labelPos === 'right' ? pos.x + 24 : pos.x}
                      y={pos.labelPos === 'top' ? pos.y - 24 : pos.labelPos === 'bottom' ? pos.y + 32 : pos.y + 8}
                      textAnchor={pos.labelPos === 'left' ? 'end' : pos.labelPos === 'right' ? 'start' : 'middle'}
                      className={`text-[18px] font-bold uppercase tracking-tight select-none pointer-events-none transition-colors ${
                        isLesioned ? 'fill-red-400' : 'fill-slate-500'
                      }`}
                    >
                      {pos.label}
                    </text>
                  )}
                </g>
              );
            })}

            {/* Connections */}
            {CONNECTIONS.map((c, i) => {
              const myTransientSpikes = transientSpikes.filter(ts => ts.from === c.from && ts.to === c.to);
              return (
                <Connection 
                  key={i} 
                  from={c.from} 
                  to={c.to} 
                  type={c.type} 
                  color={c.color} 
                  dopamine={dopamine} 
                  lesion={lesion}
                  transientSpikes={myTransientSpikes}
                />
              );
            })}

            {/* Limb Sources */}
            {LIMBS.map(limb => (
              <g key={limb.id}>
                <polygon 
                  points={`${limb.x},${limb.y - 10} ${limb.x + 18},${limb.y} ${limb.x},${limb.y + 10} ${limb.x - 18},${limb.y}`}
                  fill="#cbd5e1"
                  stroke="#475569"
                  strokeWidth="1.5"
                />
                <text 
                  x={limb.x} 
                  y={limb.y + 48} 
                  textAnchor="middle" 
                  className="text-[18px] font-bold uppercase tracking-widest fill-slate-400 select-none pointer-events-none"
                >
                  {limb.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </main>
    </div>
  );
}
