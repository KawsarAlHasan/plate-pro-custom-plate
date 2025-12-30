import React, { useEffect, useRef, useState } from 'react';

// const svg = `
// <svg width="200" height="200" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
// <path d="M100 100V0 H200V100 V200H0 V100H100 Z" fill="black"/>
// </svg>

// `

export default function Elshape( {points} ) {

    const canvasRef = useRef(null);
    const canvasWrapperRef = useRef(null);
    const [lineData, setLineData] = useState([]);

    const BASE_WIDTH = 227;
    const BASE_HEIGHT = 240;

    
    // const originalPointsRef = useRef([
    //     { x: 100, y: 0 },
    //     { x: 200, y: 0 },
    //     { x: 200, y: 200 },
    //     { x: 0, y: 200 },
    //     { x: 0, y: 100 },
    //     { x: 100, y: 100 },
    // ]);
    const originalPointsRef = useRef(points);


    const pointsRef = useRef([]);
    const colors = ['#360185', '#F4B342', '#CB9DF0', '#FFF9BF'];
    const [activeColor, setActiveColor] = useState(colors[0]);

    const hoveredEdgeRef = useRef(null);
    const hoveredCornerRef = useRef(null);
    const draggingEdgeRef = useRef(null);
    const draggingCornerRef = useRef(null);
    const offsetRef = useRef({ x: 0, y: 0 });

    const [hoveredEdge, setHoveredEdge] = useState(null);
    const [hoveredCorner, setHoveredCorner] = useState(null);

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

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
                length: Math.round(length * 100) / 100
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
        if (!pts || pts.length === 0) return;

        ctx.beginPath();
        ctx.moveTo(pts[0].x, pts[0].y);
        for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
        ctx.closePath();
        ctx.fillStyle = activeColor;
        ctx.fill();

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

        const handleRadius = Math.max(2, Math.min(4, Math.floor(canvas.width / 80)));
        for (let i = 0; i < pts.length; i++) {
            const p = pts[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, handleRadius, 0, Math.PI * 2);
            const hc = hoveredCornerRef.current;
            ctx.fillStyle = hc === i ? '#fff' : 'rgba(255,255,255,0.9)';
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#000';
            ctx.stroke();
        }
        calculateLineData();
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
            const h = 400; // Fixed height for the canvas

            canvas.width = w;
            canvas.height = h;

            // Scale shape to be smaller (about 40% of canvas size)
            const targetWidth = w * 0.4;
            const targetHeight = h * 0.4;

            const scaleX = targetWidth / BASE_WIDTH;
            const scaleY = targetHeight / BASE_HEIGHT;

            // Use uniform scale to maintain aspect ratio
            const scale = Math.min(scaleX, scaleY);

            // Calculate offset to center the shape
            const scaledWidth = BASE_WIDTH * scale;
            const scaledHeight = BASE_HEIGHT * scale;
            const offsetX = (w - scaledWidth) / 2;
            const offsetY = (h - scaledHeight) / 2;

            pointsRef.current = originalPointsRef.current.map(p => ({
                x: p.x * scale + offsetX,
                y: p.y * scale + offsetY
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
                const pt = pointsRef.current[i];

                const dx = x - offsetRef.current.x;
                const dy = y - offsetRef.current.y;

                pt.x = clamp(pt.x + dx, 0, canvas.width);
                pt.y = clamp(pt.y + dy, 0, canvas.height);

                offsetRef.current = { x, y };
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

            let foundCorner = null;
            pointsRef.current.forEach((p, i) => {
                if (isNearCorner(p, x, y, Math.max(9, canvas.width / 80))) foundCorner = i;
            });

            if (foundCorner !== null) {
                hoveredCornerRef.current = foundCorner;
                if (hoveredCorner !== foundCorner) setHoveredCorner(foundCorner);
                hoveredEdgeRef.current = null;
                if (hoveredEdge !== null) setHoveredEdge(null);
                draw();
                return;
            }

            let foundEdge = null;
            pointsRef.current.forEach((p, i) => {
                const next = pointsRef.current[(i + 1) % pointsRef.current.length];
                if (isNearEdge(p, next, x, y, Math.max(6, canvas.width / 120))) foundEdge = i;
            });

            hoveredEdgeRef.current = foundEdge;
            if (hoveredEdge !== foundEdge) setHoveredEdge(foundEdge);

            hoveredCornerRef.current = null;
            if (hoveredCorner !== null) setHoveredCorner(null);

            draw();
        };

        const handleDown = (e) => {
            const { x, y } = getMousePos(e);

            if (hoveredCornerRef.current !== null) {
                draggingCornerRef.current = hoveredCornerRef.current;
                offsetRef.current = { x, y };
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
    }, [activeColor]);

    return (
        <div ref={canvasWrapperRef} style={{ width: '100%', minHeight: 500 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8, flexWrap: 'wrap' }}>
                <h3 style={{ margin: 0, fontSize: 16 }}>Polygon Editor</h3>
                <div style={{ display: 'flex', gap: 6 }}>
                    {colors.map((c, i) => (
                        <div
                            key={i}
                            onClick={() => setActiveColor(c)}
                            style={{
                                width: 20, height: 20, background: c, cursor: 'pointer',
                                border: c === activeColor ? '2px solid #000' : '1px solid #ccc',
                                borderRadius: 2
                            }}
                        />
                    ))}
                </div>
            </div>

            <div style={{
                marginBottom: 8,
                padding: 8,
                background: '#f5f5f5',
                borderRadius: 4,
                fontSize: 11,
                maxHeight: 120,
                overflowY: 'auto',
                border: '1px solid #ddd'
            }}>
                <div style={{ fontWeight: 'bold', marginBottom: 4 }}>Edge Measurements:</div>
                {lineData.map((line) => (
                    <div key={line.index} style={{ marginBottom: 2, fontFamily: 'monospace' }}>
                        <span style={{ fontWeight: 'bold' }}>Edge {line.index}:</span> ({line.p1.x}, {line.p1.y}) → ({line.p2.x}, {line.p2.y}) | <span style={{ color: '#0066cc', fontWeight: 'bold' }}>Length: {line.length}cm</span>
                    </div>
                ))}
            </div>

            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: 600,
                    border: '2px solid #d33',
                    display: 'block',
                    backgroundColor: '#000',
                    backgroundImage: `
                    linear-gradient(#666 1px, transparent 1px),
                    linear-gradient(90deg, #666 1px, transparent 1px)
                    `,
                    // linear-gradient(135deg, green 2px, transparent 5px),
                    //     linear-gradient(45deg, red 2px, transparent 5px),
                    //     linear-gradient(305deg, blue 2px, transparent 5px),
                    //     linear-gradient(230deg, yellow 2px, transparent 5px)
                    backgroundSize: '8px 8px',
                    cursor: hoveredCorner !== null || hoveredEdge !== null ? 'pointer' : 'default'
                }}
            />
            <h1>hello world</h1>
        </div>
    );
}