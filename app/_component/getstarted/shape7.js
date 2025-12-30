'use client';

import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(Draggable);
}

const Shape7 = () => {
  const svgRef = useRef(null);
  const [isSymmetric, setIsSymmetric] = useState(true);
  const [activeColor, setActiveColor] = useState('#3b82f6');
  
  // Internal pixel coordinates for the editor
  const [points, setPoints] = useState({
    tl: { x: 200, y: 150 },
    tr: { x: 600, y: 150 },
    br: { x: 600, y: 350 },
    bl: { x: 200, y: 350 },
    cp: { x: 400, y: 80 },
  });

  const W = 800; // Viewbox Width
  const H = 450; // Viewbox Height

  // --- Helper: Convert PX to % ---
  const getPct = (px, total) => parseFloat(((px / total) * 100).toFixed(2));

  // --- Math: Distance Formula ---
  const getDist = (p1, p2) => {
    const dx = getPct(p2.x - p1.x, W);
    const dy = getPct(p2.y - p1.y, H);
    return Math.sqrt(dx * dx + dy * dy).toFixed(2);
  };

  // --- Math: Quadratic Bezier Length ---
  const getArcLen = (p0, p1, p2) => {
    const p0pct = { x: getPct(p0.x, W), y: getPct(p0.y, H) };
    const p1pct = { x: getPct(p1.x, W), y: getPct(p1.y, H) };
    const p2pct = { x: getPct(p2.x, W), y: getPct(p2.y, H) };
    
    const ax = p0pct.x - 2 * p1pct.x + p2pct.x;
    const ay = p0pct.y - 2 * p1pct.y + p2pct.y;
    const bx = 2 * p1pct.x - 2 * p0pct.x;
    const by = 2 * p1pct.y - 2 * p0pct.y;
    const A = 4 * (ax * ax + ay * ay);
    const B = 4 * (ax * bx + ay * by);
    const C = bx * bx + by * by;
    if (A === 0) return getDist(p0, p2);
    const abc = 2 * Math.sqrt(A + B + C);
    const a = Math.sqrt(A);
    const b = B / (2 * a);
    const c = Math.sqrt(C);
    const exp = Math.log((2 * a + b + abc) / (b + c));
    return (((a * b + abc * a) + (4 * C * a - b * b) * exp) / (4 * a)).toFixed(2);
  };

  // --- Generate Percentage Data ---
  const generateExportData = () => {
    const pctPoints = {
      tl: { x: getPct(points.tl.x, W), y: getPct(points.tl.y, H) },
      tr: { x: getPct(points.tr.x, W), y: getPct(points.tr.y, H) },
      br: { x: getPct(points.br.x, W), y: getPct(points.br.y, H) },
      bl: { x: getPct(points.bl.x, W), y: getPct(points.bl.y, H) },
      cp: { x: getPct(points.cp.x, W), y: getPct(points.cp.y, H) },
    };

    const pathPct = `M ${pctPoints.bl.x}% ${pctPoints.bl.y}% L ${pctPoints.br.x}% ${pctPoints.br.y}% L ${pctPoints.tr.x}% ${pctPoints.tr.y}% Q ${pctPoints.cp.x}% ${pctPoints.cp.y}% ${pctPoints.tl.x}% ${pctPoints.tl.y}% Z`;

    return {
      points: pctPoints,
      path: pathPct,
      lengths: {
        bottom: getDist(points.bl, points.br),
        right: getDist(points.br, points.tr),
        left: getDist(points.tl, points.bl),
        arc: getArcLen(points.tr, points.cp, points.tl)
      },
      color: activeColor
    };
  };

  const exportData = generateExportData();

  const gotonextpage = () => {
    sessionStorage.setItem('shapeDesignData', JSON.stringify(exportData));
    window.location.href = '/previewandsummary';
  };

  useEffect(() => {
    const draggables = Object.keys(points).map((key) => {
      return Draggable.create(`#drag-target-${key}`, {
        type: 'x,y',
        onDrag: function (e) {
          const svg = svgRef.current;
          const pt = svg.createSVGPoint();
          pt.x = e.clientX || (e.touches && e.touches[0].clientX);
          pt.y = e.clientY || (e.touches && e.touches[0].clientY);
          const svgP = pt.matrixTransform(svg.getScreenCTM().inverse());

          setPoints((prev) => {
            const next = { ...prev, [key]: { x: svgP.x, y: svgP.y } };
            if (isSymmetric) {
              if (key === 'tr') next.tl = { x: W - svgP.x, y: svgP.y };
              if (key === 'tl') next.tr = { x: W - svgP.x, y: svgP.y };
              if (key === 'br') next.bl = { x: W - svgP.x, y: svgP.y };
              if (key === 'bl') next.br = { x: W - svgP.x, y: svgP.y };
              if (key === 'cp') next.cp.x = W / 2;
            }
            return next;
          });
          gsap.set(this.target, { x: 0, y: 0 });
        },
      })[0];
    });
    return () => draggables.forEach(d => d.kill());
  }, [isSymmetric]);

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col items-center p-6 select-none font-sans">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-6 bg-white p-4 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
          <h2 className="font-bold text-slate-800">Plate Configurator</h2>
          <div className="flex gap-1">
            {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map(c => (
              <button key={c} onClick={() => setActiveColor(c)} className="w-5 h-5 rounded-full" style={{backgroundColor: c}} />
            ))}
          </div>
        </div>
        <button onClick={gotonextpage} className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md">
          Next: Preview →
        </button>
      </div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* SVG Canvas */}
        <div className="lg:col-span-2 aspect-video bg-white rounded-3xl shadow-inner border border-slate-200 relative overflow-hidden">
          <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="w-full h-full touch-none">
            <path 
              d={`M ${points.bl.x} ${points.bl.y} L ${points.br.x} ${points.br.y} L ${points.tr.x} ${points.tr.y} Q ${points.cp.x} ${points.cp.y} ${points.tl.x} ${points.tl.y} Z`} 
              fill={`${activeColor}15`} stroke={activeColor} strokeWidth="3" 
            />
            {Object.entries(points).map(([key, pos]) => (
              <g key={key} id={`drag-target-${key}`}>
                <circle cx={pos.x} cy={pos.y} r="30" fill="transparent" className="cursor-grab" />
                <circle cx={pos.x} cy={pos.y} r="6" fill={key === 'cp' ? '#f43f5e' : activeColor} stroke="white" strokeWidth="2" />
              </g>
            ))}
          </svg>
        </div>

        {/* JSON & Info Panel */}
        <div className="flex flex-col gap-4">
          <div className="bg-slate-900 rounded-2xl p-5 shadow-xl">
            <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-3 opacity-60">Export JSON (Normalized %)</h3>
            <pre className="text-[10px] text-emerald-400 font-mono overflow-auto max-h-[300px] leading-tight">
              {JSON.stringify(exportData, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
            <h3 className="text-slate-400 text-xs font-bold uppercase mb-3">Calculated Percent Lengths</h3>
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(exportData.lengths).map(([label, val]) => (
                <div key={label}>
                  <p className="text-[10px] text-slate-400 uppercase">{label}</p>
                  <p className="font-mono text-lg text-slate-700">{val}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shape7;