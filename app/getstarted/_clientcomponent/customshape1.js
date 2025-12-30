import React from 'react'

export default function Customshape1() {
   const canvasRef = useRef(null);
      const canvasWrapperRef = useRef(null);
      const [lineData, setLineData] = useState([]);
  
      const BASE_WIDTH = 227;
      const BASE_HEIGHT = 240;
  
      const initialPoints = [
          { x: 100, y: 0, radius: 0 },
          { x: 200, y: 0, radius: 15 },
          { x: 200, y: 200, radius: 20 },
          { x: 0, y: 200, radius: 10 },
          { x: 0, y: 100, radius: 0 },
          { x: 100, y: 100, radius: 25 },
      ];
  
      const initialHoles = [
          { x: 100, y: 80, radius: 8 },
          { x: 120, y: 120, radius: 10 }
      ];
  
      const originalPointsRef = useRef(initialPoints);
      const originalHolesRef = useRef(initialHoles);
      const pointsRef = useRef([]);
      const holesRef = useRef([]);
  
      const colors = ['#360185', '#F4B342', '#CB9DF0', '#FFF9BF'];
      const [activeColor, setActiveColor] = useState(colors[0]);
      const [selectedCorner, setSelectedCorner] = useState(null);
      const [cornerRadii, setCornerRadii] = useState(initialPoints.map(p => p.radius));
  
      const MIN_WIDTH = 80;
      const MIN_HEIGHT = 80;
  
      const hoveredEdgeRef = useRef(null);
      const hoveredCornerRef = useRef(null);
      const hoveredHoleRef = useRef(null);
      const draggingEdgeRef = useRef(null);
      const draggingCornerRef = useRef(null);
      const draggingHoleRef = useRef(null);
      const offsetRef = useRef({ x: 0, y: 0 });
  
      const [hoveredEdge, setHoveredEdge] = useState(null);
      const [hoveredCorner, setHoveredCorner] = useState(null);
      const [hoveredHole, setHoveredHole] = useState(null);
      const [svgPathData, setSvgPathData] = useState('');
      const [showExport, setShowExport] = useState(false);
  
      const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  
      const distance = (p1, p2) => {
          const dx = p2.x - p1.x;
          const dy = p2.y - p1.y;
          return Math.sqrt(dx * dx + dy * dy);
      };
      // ======svg client bounding=====
      const getBoundingBox = (points) => {
          const xs = points.map(p => p.x);
          const ys = points.map(p => p.y);
          return {
              minX: Math.min(...xs),
              maxX: Math.max(...xs),
              minY: Math.min(...ys),
              maxY: Math.max(...ys),
              width: Math.max(...xs) - Math.min(...xs),
              height: Math.max(...ys) - Math.min(...ys)
          };
      };
      // =======objerver for hole=======
      const isPointInPolygon = (point, polygon) => {
          let inside = false;
          for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
              const xi = polygon[i].x, yi = polygon[i].y;
              const xj = polygon[j].x, yj = polygon[j].y;
              const intersect = ((yi > point.y) !== (yj > point.y))
                  && (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
              if (intersect) inside = !inside;
          }
          return inside;
      };
  
      const projectPointOnSegment = (p, a, b) => {
          const atob = { x: b.x - a.x, y: b.y - a.y };
          const atop = { x: p.x - a.x, y: p.y - a.y };
          const len = atob.x * atob.x + atob.y * atob.y;
          let dot = atop.x * atob.x + atop.y * atob.y;
          const t = Math.min(1, Math.max(0, dot / len));
          return {
              x: a.x + atob.x * t,
              y: a.y + atob.y * t
          };
      };
  
      const constrainHolePosition = (hole, shapePoints) => {
          if (!isPointInPolygon(hole, shapePoints)) {
              let minDist = Infinity;
              let closest = { x: hole.x, y: hole.y };
  
              for (let i = 0; i < shapePoints.length; i++) {
                  const p1 = shapePoints[i];
                  const p2 = shapePoints[(i + 1) % shapePoints.length];
  
                  const projected = projectPointOnSegment(hole, p1, p2);
                  const dist = distance(hole, projected);
  
                  if (dist < minDist) {
                      minDist = dist;
                      const dx = hole.x - projected.x;
                      const dy = hole.y - projected.y;
                      const len = Math.sqrt(dx * dx + dy * dy);
                      closest = {
                          x: projected.x + (dx / len) * 10,
                          y: projected.y + (dy / len) * 10
                      };
                  }
              }
  
              return closest;
          }
          return hole;
      };
  
      const constrainCornerMove = (points, cornerIndex, newX, newY) => {
          const testPoints = points.map((p, i) =>
              i === cornerIndex ? { ...p, x: newX, y: newY } : { ...p }
          );
  
          const bbox = getBoundingBox(testPoints);
  
          if (bbox.width < MIN_WIDTH || bbox.height < MIN_HEIGHT) {
              const center = {
                  x: (bbox.minX + bbox.maxX) / 2,
                  y: (bbox.minY + bbox.maxY) / 2
              };
  
              const dx = newX - center.x;
              const dy = newY - center.y;
              const angle = Math.atan2(dy, dx);
  
              const widthDiff = Math.max(0, MIN_WIDTH - bbox.width);
              const heightDiff = Math.max(0, MIN_HEIGHT - bbox.height);
  
              return {
                  x: newX + Math.cos(angle) * widthDiff / 2,
                  y: newY + Math.sin(angle) * heightDiff / 2
              };
          }
  
          return { x: newX, y: newY };
      };
  
      const drawRoundedPolygon = (ctx, points) => {
          ctx.beginPath();
  
          for (let i = 0; i < points.length; i++) {
              const curr = points[i];
              const next = points[(i + 1) % points.length];
              const prev = points[(i - 1 + points.length) % points.length];
  
              const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
              const v2 = { x: next.x - curr.x, y: next.y - curr.y };
  
              const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
              const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
              const maxRadius = Math.min(len1 / 2, len2 / 2, curr.radius || 0);
  
              if (maxRadius > 0) {
                  const ratio1 = maxRadius / len1;
                  const ratio2 = maxRadius / len2;
  
                  const arcStart = {
                      x: curr.x - v1.x * ratio1,
                      y: curr.y - v1.y * ratio1
                  };
  
                  const arcEnd = {
                      x: curr.x + v2.x * ratio2,
                      y: curr.y + v2.y * ratio2
                  };
  
                  if (i === 0) {
                      ctx.moveTo(arcStart.x, arcStart.y);
                  } else {
                      ctx.lineTo(arcStart.x, arcStart.y);
                  }
  
                  ctx.quadraticCurveTo(curr.x, curr.y, arcEnd.x, arcEnd.y);
              } else {
                  if (i === 0) {
                      ctx.moveTo(curr.x, curr.y);
                  } else {
                      ctx.lineTo(curr.x, curr.y);
                  }
              }
          }
  
          ctx.closePath();
      };
  
      const generateSVGPath = (points, holes) => {
          let pathData = '';
  
          // Generate outer path
          for (let i = 0; i < points.length; i++) {
              const curr = points[i];
              const next = points[(i + 1) % points.length];
              const prev = points[(i - 1 + points.length) % points.length];
  
              const v1 = { x: curr.x - prev.x, y: curr.y - prev.y };
              const v2 = { x: next.x - curr.x, y: next.y - curr.y };
  
              const len1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
              const len2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);
  
              const maxRadius = Math.min(len1 / 2, len2 / 2, curr.radius || 0);
  
              if (maxRadius > 0) {
                  const ratio1 = maxRadius / len1;
                  const ratio2 = maxRadius / len2;
  
                  const arcStart = {
                      x: curr.x - v1.x * ratio1,
                      y: curr.y - v1.y * ratio1
                  };
  
                  const arcEnd = {
                      x: curr.x + v2.x * ratio2,
                      y: curr.y + v2.y * ratio2
                  };
  
                  if (i === 0) {
                      pathData += `M ${arcStart.x.toFixed(2)} ${arcStart.y.toFixed(2)} `;
                  } else {
                      pathData += `L ${arcStart.x.toFixed(2)} ${arcStart.y.toFixed(2)} `;
                  }
  
                  pathData += `Q ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} ${arcEnd.x.toFixed(2)} ${arcEnd.y.toFixed(2)} `;
              } else {
                  if (i === 0) {
                      pathData += `M ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} `;
                  } else {
                      pathData += `L ${curr.x.toFixed(2)} ${curr.y.toFixed(2)} `;
                  }
              }
          }
  
          pathData += 'Z ';
  
          // Add holes
          holes.forEach(hole => {
              pathData += `M ${(hole.x + hole.radius).toFixed(2)} ${hole.y.toFixed(2)} `;
              pathData += `A ${hole.radius.toFixed(2)} ${hole.radius.toFixed(2)} 0 1 0 ${(hole.x - hole.radius).toFixed(2)} ${hole.y.toFixed(2)} `;
              pathData += `A ${hole.radius.toFixed(2)} ${hole.radius.toFixed(2)} 0 1 0 ${(hole.x + hole.radius).toFixed(2)} ${hole.y.toFixed(2)} `;
              pathData += 'Z ';
          });
  
          return pathData.trim();
      };
  
      const calculateLineData = () => {
          const points = pointsRef.current;
          if (!points || points.length === 0) return;
  
          const result = points.map((p, i) => {
              const next = points[(i + 1) % points.length];
              const dx = next.x - p.x;
              const dy = next.y - p.y;
              const length = Math.sqrt(dx * dx + dy * dy);
  
              return {
                  index: i,
                  p1: { x: Math.round(p.x * 100) / 100, y: Math.round(p.y * 100) / 100 },
                  p2: { x: Math.round(next.x * 100) / 100, y: Math.round(next.y * 100) / 100 },
                  length: Math.round(length * 100) / 100,
                  radius: p.radius || 0
              };
          });
  
          setLineData(result);
      };
  
      const draw = () => {
          const canvas = canvasRef.current;
          if (!canvas) return;
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
  
          const pts = pointsRef.current;
          const holes = holesRef.current;
          if (!pts || pts.length === 0) return;
  
          // Draw main shape with holes
          drawRoundedPolygon(ctx, pts);
  
          // Add holes to the path
          holes.forEach(hole => {
              ctx.moveTo(hole.x + hole.radius, hole.y);
              ctx.arc(hole.x, hole.y, hole.radius, 0, Math.PI * 2, true);
          });
  
          ctx.fillStyle = activeColor;
          ctx.fill('evenodd');
  
          // Draw edges
          for (let i = 0; i < pts.length; i++) {
              const p1 = pts[i];
              const p2 = pts[(i + 1) % pts.length];
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              const he = hoveredEdgeRef.current;
              ctx.strokeStyle = he === i ? 'yellow' : 'rgba(255,0,0,0.6)';
              ctx.lineWidth = he === i ? 4 : 2;
              ctx.stroke();
          }
  
          // Draw corner handles
          const handleRadius = Math.max(3, Math.min(5, Math.floor(canvas.width / 80)));
          for (let i = 0; i < pts.length; i++) {
              const p = pts[i];
              ctx.beginPath();
              ctx.arc(p.x, p.y, handleRadius, 0, Math.PI * 2);
              const hc = hoveredCornerRef.current;
              ctx.fillStyle = hc === i ? '#ffff00' : 'rgba(255,255,255,0.9)';
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = '#000';
              ctx.stroke();
          }
  
          // Draw hole handles
          holes.forEach((hole, i) => {
              ctx.beginPath();
              ctx.arc(hole.x, hole.y, handleRadius, 0, Math.PI * 2);
              const hh = hoveredHoleRef.current;
              ctx.fillStyle = hh === i ? '#00ffff' : 'rgba(0,255,255,0.7)';
              ctx.fill();
              ctx.lineWidth = 2;
              ctx.strokeStyle = '#0088cc';
              ctx.stroke();
          });
  
          calculateLineData();
          updateSVGPath();
      };
  
      const updateSVGPath = () => {
          const svgPath = generateSVGPath(pointsRef.current, holesRef.current);
          setSvgPathData(svgPath);
      };
  
      const getMousePos = (e) => {
          const canvas = canvasRef.current;
          const rect = canvas.getBoundingClientRect();
          const scaleX = canvas.width / rect.width;
          const scaleY = canvas.height / rect.height;
          return {
              x: (e.clientX - rect.left) * scaleX,
              y: (e.clientY - rect.top) * scaleY,
          };
      };
  
      const isNearEdge = (p1, p2, x, y, tol = 6) => {
          const A = x - p1.x;
          const B = y - p1.y;
          const C = p2.x - p1.x;
          const D = p2.y - p1.y;
          const dot = A * C + B * D;
          const len_sq = C * C + D * D;
          let param = len_sq !== 0 ? dot / len_sq : -1;
          if (param < 0) param = 0;
          if (param > 1) param = 1;
          const xx = p1.x + param * C;
          const yy = p1.y + param * D;
          const dx = x - xx;
          const dy = y - yy;
          return dx * dx + dy * dy <= tol * tol;
      };
  
      const isNearCorner = (p, x, y, tol = 10) => {
          const dx = x - p.x;
          const dy = y - p.y;
          return dx * dx + dy * dy <= tol * tol;
      };
  
      useEffect(() => {
          const canvas = canvasRef.current;
          const wrapper = canvasWrapperRef.current;
          if (!canvas || !wrapper) return;
  
          const updateSize = () => {
              const w = wrapper.offsetWidth || 300;
              const h = 500;
  
              canvas.width = w;
              canvas.height = h;
  
              const targetWidth = w * 0.4;
              const targetHeight = h * 0.4;
  
              const scaleX = targetWidth / BASE_WIDTH;
              const scaleY = targetHeight / BASE_HEIGHT;
              const scale = Math.min(scaleX, scaleY);
  
              const scaledWidth = BASE_WIDTH * scale;
              const scaledHeight = BASE_HEIGHT * scale;
              const offsetX = (w - scaledWidth) / 2;
              const offsetY = (h - scaledHeight) / 2;
  
              pointsRef.current = originalPointsRef.current.map(p => ({
                  x: p.x * scale + offsetX,
                  y: p.y * scale + offsetY,
                  radius: p.radius * scale
              }));
  
              holesRef.current = originalHolesRef.current.map(h => ({
                  x: h.x * scale + offsetX,
                  y: h.y * scale + offsetY,
                  radius: h.radius * scale
              }));
  
              draw();
          };
  
          window.addEventListener('resize', updateSize);
          updateSize();
          return () => window.removeEventListener('resize', updateSize);
      }, []);
  
      useEffect(() => {
          const canvas = canvasRef.current;
          if (!canvas) return;
  
          const handleMove = (e) => {
              const { x, y } = getMousePos(e);
  
              if (draggingCornerRef.current !== null) {
                  const i = draggingCornerRef.current;
                  const constrained = constrainCornerMove(pointsRef.current, i, x, y);
  
                  pointsRef.current[i].x = clamp(constrained.x, 0, canvas.width);
                  pointsRef.current[i].y = clamp(constrained.y, 0, canvas.height);
  
                  draw();
                  return;
              }
  
              if (draggingHoleRef.current !== null) {
                  const i = draggingHoleRef.current;
                  const newPos = { x, y, radius: holesRef.current[i].radius };
                  const constrained = constrainHolePosition(newPos, pointsRef.current);
  
                  holesRef.current[i].x = clamp(constrained.x, 0, canvas.width);
                  holesRef.current[i].y = clamp(constrained.y, 0, canvas.height);
  
                  draw();
                  return;
              }
  
              if (draggingEdgeRef.current !== null) {
                  const i1 = draggingEdgeRef.current;
                  const i2 = (i1 + 1) % pointsRef.current.length;
                  const p1 = pointsRef.current[i1];
                  const p2 = pointsRef.current[i2];
  
                  const dx = x - offsetRef.current.x;
                  const dy = y - offsetRef.current.y;
  
                  p1.x = clamp(p1.x + dx, 0, canvas.width);
                  p1.y = clamp(p1.y + dy, 0, canvas.height);
                  p2.x = clamp(p2.x + dx, 0, canvas.width);
                  p2.y = clamp(p2.y + dy, 0, canvas.height);
  
                  offsetRef.current = { x, y };
                  draw();
                  return;
              }
  
              // Check holes first
              let foundHole = null;
              holesRef.current.forEach((h, i) => {
                  if (isNearCorner(h, x, y, Math.max(12, canvas.width / 80))) foundHole = i;
              });
  
              if (foundHole !== null) {
                  hoveredHoleRef.current = foundHole;
                  if (hoveredHole !== foundHole) setHoveredHole(foundHole);
                  hoveredCornerRef.current = null;
                  hoveredEdgeRef.current = null;
                  if (hoveredCorner !== null) setHoveredCorner(null);
                  if (hoveredEdge !== null) setHoveredEdge(null);
                  draw();
                  return;
              }
  
              // Check corners
              let foundCorner = null;
              pointsRef.current.forEach((p, i) => {
                  if (isNearCorner(p, x, y, Math.max(10, canvas.width / 80))) foundCorner = i;
              });
  
              if (foundCorner !== null) {
                  hoveredCornerRef.current = foundCorner;
                  if (hoveredCorner !== foundCorner) setHoveredCorner(foundCorner);
                  hoveredEdgeRef.current = null;
                  hoveredHoleRef.current = null;
                  if (hoveredEdge !== null) setHoveredEdge(null);
                  if (hoveredHole !== null) setHoveredHole(null);
                  draw();
                  return;
              }
  
              // Check edges
              let foundEdge = null;
              pointsRef.current.forEach((p, i) => {
                  const next = pointsRef.current[(i + 1) % pointsRef.current.length];
                  if (isNearEdge(p, next, x, y, Math.max(6, canvas.width / 120))) foundEdge = i;
              });
  
              hoveredEdgeRef.current = foundEdge;
              if (hoveredEdge !== foundEdge) setHoveredEdge(foundEdge);
  
              hoveredCornerRef.current = null;
              hoveredHoleRef.current = null;
              if (hoveredCorner !== null) setHoveredCorner(null);
              if (hoveredHole !== null) setHoveredHole(null);
  
              draw();
          };
  
          const handleDown = (e) => {
              const { x, y } = getMousePos(e);
  
              if (hoveredHoleRef.current !== null) {
                  draggingHoleRef.current = hoveredHoleRef.current;
                  return;
              }
  
              if (hoveredCornerRef.current !== null) {
                  draggingCornerRef.current = hoveredCornerRef.current;
                  setSelectedCorner(hoveredCornerRef.current);
                  return;
              }
  
              if (hoveredEdgeRef.current !== null) {
                  draggingEdgeRef.current = hoveredEdgeRef.current;
                  offsetRef.current = { x, y };
                  return;
              }
          };
  
          const handleUp = () => {
              draggingCornerRef.current = null;
              draggingEdgeRef.current = null;
              draggingHoleRef.current = null;
          };
  
          canvas.addEventListener('mousemove', handleMove);
          canvas.addEventListener('mousedown', handleDown);
          window.addEventListener('mouseup', handleUp);
  
          draw();
  
          return () => {
              canvas.removeEventListener('mousemove', handleMove);
              canvas.removeEventListener('mousedown', handleDown);
              window.removeEventListener('mouseup', handleUp);
          };
      }, [activeColor, cornerRadii]);
  
      const updateCornerRadius = (index, value) => {
          const newRadii = [...cornerRadii];
          newRadii[index] = parseFloat(value);
          setCornerRadii(newRadii);
          pointsRef.current[index].radius = parseFloat(value);
          draw();
      };
  
      const exportToJSON = () => {
          const canvas = canvasRef.current;
          const bbox = getBoundingBox(pointsRef.current);
  
          const exportData = {
              viewBox: `0 0 ${canvas.width} ${canvas.height}`,
              boundingBox: {
                  x: bbox.minX,
                  y: bbox.minY,
                  width: bbox.width,
                  height: bbox.height
              },
              corners: pointsRef.current.map(p => ({
                  x: Math.round(p.x * 100) / 100,
                  y: Math.round(p.y * 100) / 100,
                  radius: Math.round((p.radius || 0) * 100) / 100
              })),
              holes: holesRef.current.map(h => ({
                  x: Math.round(h.x * 100) / 100,
                  y: Math.round(h.y * 100) / 100,
                  radius: Math.round(h.radius * 100) / 100
              })),
              svgPath: svgPathData,
              color: activeColor
          };
  
          return JSON.stringify(exportData, null, 2);
      };
  
      const copyToClipboard = (text) => {
          navigator.clipboard.writeText(text).then(() => {
              alert('Copied to clipboard!');
          });
      };
      const gotonextpage = () => {
          console.log(svgPathData);
          sessionStorage.setItem('svgPath', svgPathData);
          sessionStorage.setItem('activeColor', activeColor);
          window.location.href = '/previewandsummary';
      }
  
      return (
          <div ref={canvasWrapperRef} style={{ width: '100%', minHeight: 600, padding: 20, background: '#1a1a1a' }}>
              <div style={{ marginBottom: 16 }}>
                  <h2 style={{ margin: 0, marginBottom: 12, color: '#fff', fontSize: 24 }}>Enhanced Polygon Editor</h2>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                      <span style={{ color: '#aaa', fontSize: 14 }}>Color:</span>
                      {colors.map((c, i) => (
                          <div
                              key={i}
                              onClick={() => setActiveColor(c)}
                              style={{
                                  width: 32, height: 32, background: c, cursor: 'pointer',
                                  border: c === activeColor ? '3px solid #fff' : '2px solid #666',
                                  borderRadius: 4,
                                  transition: 'all 0.2s'
                              }}
                          />
                      ))}
                  </div>
              </div>
  
              {selectedCorner !== null && (
                  <div style={{
                      marginBottom: 12,
                      padding: 12,
                      background: '#2a2a2a',
                      borderRadius: 6,
                      border: '1px solid #444'
                  }}>
                      <div style={{ color: '#fff', marginBottom: 8, fontWeight: 'bold' }}>
                          Corner {selectedCorner} Radius Control
                      </div>
                      <input
                          type="range"
                          min="0"
                          max="50"
                          step="1"
                          value={cornerRadii[selectedCorner]}
                          onChange={(e) => updateCornerRadius(selectedCorner, e.target.value)}
                          style={{ width: '100%' }}
                      />
                      <div style={{ color: '#aaa', fontSize: 12, marginTop: 4 }}>
                          Radius: {cornerRadii[selectedCorner]}px
                      </div>
                  </div>
              )}
  
              <div style={{
                  marginBottom: 12,
                  padding: 12,
                  background: '#2a2a2a',
                  borderRadius: 6,
                  fontSize: 12,
                  maxHeight: 180,
                  overflowY: 'auto',
                  border: '1px solid #444',
                  color: '#ccc'
              }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8, color: '#fff' }}>📏 Edge Measurements:</div>
                  {lineData.map((line) => (
                      <div key={line.index} style={{ marginBottom: 6, fontFamily: 'monospace', fontSize: 11 }}>
                          <span style={{ color: '#F4B342', fontWeight: 'bold' }}>Edge {line.index}:</span>{' '}
                          ({line.p1.x.toFixed(1)}, {line.p1.y.toFixed(1)}) → ({line.p2.x.toFixed(1)}, {line.p2.y.toFixed(1)}) |{' '}
                          <span style={{ color: '#CB9DF0', fontWeight: 'bold' }}>Length: {line.length.toFixed(1)}px</span>{' '}
                          {line.radius > 0 && <span style={{ color: '#0ff' }}>| Radius: {line.radius.toFixed(1)}px</span>}
                      </div>
                  ))}
                  <div style={{ marginTop: 12, paddingTop: 8, borderTop: '1px solid #444' }}>
                      <div style={{ fontWeight: 'bold', marginBottom: 4, color: '#fff' }}>🕳️ Holes:</div>
                      {holesRef.current.map((hole, i) => (
                          <div key={i} style={{ fontSize: 11, marginBottom: 4 }}>
                              <span style={{ color: '#0ff', fontWeight: 'bold' }}>Hole {i}:</span>{' '}
                              ({hole.x.toFixed(1)}, {hole.y.toFixed(1)}) | Radius: {hole.radius.toFixed(1)}px
                          </div>
                      ))}
                  </div>
              </div>
  
              <canvas
                  ref={canvasRef}
                  style={{
                      width: '100%',
                      height: 500,
                      border: '2px solid #444',
                      display: 'block',
                      backgroundColor: '#0a0a0a',
                      backgroundImage: `
                          linear-gradient(#222 1px, transparent 1px),
                          linear-gradient(90deg, #222 1px, transparent 1px)
                      `,
                      backgroundSize: '20px 20px',
                      borderRadius: 8,
                      cursor: hoveredCorner !== null || hoveredEdge !== null || hoveredHole !== null ? 'pointer' : 'default'
                  }}
              />
  
              <div style={{
                  marginTop: 12,
                  padding: 12,
                  background: '#2a2a2a',
                  borderRadius: 6,
                  fontSize: 12,
                  color: '#aaa',
                  border: '1px solid #444'
              }}>
                  <div style={{ color: '#fff', fontWeight: 'bold', marginBottom: 4 }}>✨ Features:</div>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                      <li>🔴 Red edges - drag to move entire edge</li>
                      <li>⚪ White corners - drag to reshape (click to adjust radius)</li>
                      <li>🔵 Cyan holes - drag to reposition (auto-constrained inside shape)</li>
                      <li>📐 Minimum size constraint: {MIN_WIDTH}x{MIN_HEIGHT}px</li>
                      <li>🎨 Corner radius support with smart overlap prevention</li>
                  </ul>
              </div>
  
              <div style={{
                  marginTop: 12,
                  padding: 16,
                  background: '#2a2a2a',
                  borderRadius: 6,
                  border: '1px solid #444'
              }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <h3 style={{ margin: 0, color: '#fff', fontSize: 18 }}>📤 Export Data</h3>
                      <button
                          onClick={() => setShowExport(!showExport)}
                          style={{
                              padding: '6px 12px',
                              background: '#444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: 4,
                              cursor: 'pointer',
                              fontSize: 12
                          }}
                      >
                          {showExport ? 'Hide' : 'Show'}
                      </button>
                  </div>
  
                  {showExport && (
                      <>
                          <div style={{ marginBottom: 12 }}>
                              <div style={{ color: '#aaa', fontSize: 12, marginBottom: 6 }}>SVG Path Data:</div>
                              <div style={{
                                  background: '#1a1a1a',
                                  padding: 12,
                                  borderRadius: 4,
                                  fontFamily: 'monospace',
                                  fontSize: 11,
                                  color: '#0f0',
                                  overflowX: 'auto',
                                  whiteSpace: 'pre-wrap',
                                  wordBreak: 'break-all',
                                  maxHeight: 120,
                                  overflowY: 'auto',
                                  border: '1px solid #333'
                              }}>
                                  {svgPathData}
                              </div>
                              <button
                                  onClick={() => copyToClipboard(svgPathData)}
                                  style={{
                                      marginTop: 8,
                                      padding: '6px 12px',
                                      background: '#0066cc',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: 12
                                  }}
                              >
                                  Copy SVG Path
                              </button>
                          </div>
  
                          <div style={{ marginBottom: 12 }}>
                              <div style={{ color: '#aaa', fontSize: 12, marginBottom: 6 }}>Complete JSON Export:</div>
                              <div style={{
                                  background: '#1a1a1a',
                                  padding: 12,
                                  borderRadius: 4,
                                  fontFamily: 'monospace',
                                  fontSize: 11,
                                  color: '#ff0',
                                  overflowX: 'auto',
                                  whiteSpace: 'pre',
                                  maxHeight: 200,
                                  overflowY: 'auto',
                                  border: '1px solid #333'
                              }}>
                                  {exportToJSON()}
                              </div>
                              <button
                                  onClick={() => copyToClipboard(exportToJSON())}
                                  style={{
                                      marginTop: 8,
                                      padding: '6px 12px',
                                      background: '#0066cc',
                                      color: '#fff',
                                      border: 'none',
                                      borderRadius: 4,
                                      cursor: 'pointer',
                                      fontSize: 12
                                  }}
                              >
                                  Copy JSON Data
                              </button>
                          </div>
  
                          <div style={{
                              background: '#1a1a1a',
                              padding: 12,
                              borderRadius: 4,
                              border: '1px solid #333'
                          }}>
                              <div style={{ color: '#fff', fontSize: 12, marginBottom: 8, fontWeight: 'bold' }}>
                                  SVG Preview:
                              </div>
                              <svg
                                  viewBox={`0 0 ${canvasRef.current?.width || 600} ${canvasRef.current?.height || 500}`}
                                  style={{
                                      width: '100%',
                                      maxHeight: 200,
                                      background: '#000',
                                      border: '1px solid #444',
                                      borderRadius: 4
                                  }}
                              >
                                  <path
                                      d={svgPathData}
                                      fill={activeColor}
                                      fillRule="evenodd"
                                  />
                              </svg>
                          </div>
  
                      </>
                  )}
                  <div className='w-full flex justify-end'>
                      <button
                      onClick={gotonextpage}
                          className='px-8 py-3 bg-white mt-8 mb-5'
                      >
                          next
                      </button>
                  </div>
              </div>
          </div>
      );
}
