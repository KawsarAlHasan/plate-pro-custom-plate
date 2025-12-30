"use client";
import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import Draggable from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const ShapePreview5 = () => {
    const stageRef = useRef(null);
    const shapeRef = useRef(null);
    const pointRefs = useRef([]);
    const edgeRefs = useRef([]);
    const edgeTextRefs = useRef([]);

    const [cornerRadius, setCornerRadius] = useState([
        20, 20, 20, 20
    ]);
    const [edgeLengths, setEdgeLengths] = useState([]);

    // Default 4-point rectangle
    const points = useRef([
        { x: 150, y: 100 },
        { x: 450, y: 100 },
        { x: 450, y: 250 },
        { x: 150, y: 250 },
    ]);

    /* -----------------------------------------
       Utility: Build rounded polygon path
    ----------------------------------------- */
    const getRoundedPath = useCallback((pts, rads) => {
        if (pts.length < 3) return "";

        let path = "";
        const L = pts.length;


        for (let i = 0; i < L; i++) {
            const p0 = pts[(i - 1 + L) % L];
            const p1 = pts[i];
            const p2 = pts[(i + 1) % L];

            const radius = rads[i];

            const v1 = { x: p1.x - p0.x, y: p1.y - p0.y };
            const v2 = { x: p1.x - p2.x, y: p1.y - p2.y };

            const mag1 = Math.hypot(v1.x, v1.y);
            const mag2 = Math.hypot(v2.x, v2.y);

            const r = Math.min(radius, mag1 / 2, mag2 / 2);

            const u1 = { x: v1.x / mag1, y: v1.y / mag1 };
            const u2 = { x: v2.x / mag2, y: v2.y / mag2 };

            const start = { x: p1.x - u1.x * r, y: p1.y - u1.y * r };
            const end = { x: p1.x - u2.x * r, y: p1.y - u2.y * r };

            if (i === 0) path += `M ${start.x},${start.y}`;
            else path += `L ${start.x},${start.y}`;

            path += `Q ${p1.x},${p1.y} ${end.x},${end.y}`;
        }

        return path + " Z";
    }, []);

    /* -----------------------------------------
       Redraw shape, update edge lengths/labels
    ----------------------------------------- */
    const drawShape = useCallback(() => {
        const stageRect = stageRef.current.getBoundingClientRect();
        const pts = [];

        pointRefs.current.forEach((el) => {
            const x = gsap.getProperty(el, "x") || 0;
            const y = gsap.getProperty(el, "y") || 0;
            const rect = el.getBoundingClientRect();

            pts.push({
                x: rect.left - stageRect.left + rect.width / 2 + x,
                y: rect.top - stageRect.top + rect.height / 2 + y,
            });
        });

        const d = getRoundedPath(pts, cornerRadius);
        shapeRef.current.setAttribute("d", d);

        const lengths = [];

        pts.forEach((p1, i) => {
            const p2 = pts[(i + 1) % pts.length];
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const len = Math.hypot(dx, dy);

            lengths.push(len);

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            gsap.set(edgeRefs.current[i], { x: midX, y: midY });

            const text = edgeTextRefs.current[i];
            if (text) {
                gsap.set(text, {
                    x: midX,
                    y: midY - 55,
                    xPercent: -50,
                    yPercent: -50,
                    rotation: Math.atan2(dy, dx) * 180 / Math.PI,
                });
            }
        });

        setEdgeLengths(lengths);
    }, [cornerRadius, getRoundedPath]);

    /* -----------------------------------------
       Initialize Draggable
    ----------------------------------------- */
    useEffect(() => {
        if (!stageRef.current) return;

        const stage = stageRef.current;

        // Clean old draggables
        [...pointRefs.current, ...edgeRefs.current].forEach((el) => {
            Draggable.get(el)?.kill();
        });

        // Corners
        pointRefs.current.forEach((el) => {
            Draggable.create(el, {
                type: "x,y",
                bounds: stage,
                onDrag: drawShape,
                onPress: drawShape,
                onRelease: drawShape,
            });
        });

        // Edges
        edgeRefs.current.forEach((el, i) => {
            Draggable.create(el, {
                type: "x,y",
                bounds: stage,
                onPress() {
                    this.startX = this.x;
                    this.startY = this.y;
                },
                onDrag() {
                    const dx = this.x - this.startX;
                    const dy = this.y - this.startY;
                    this.startX = this.x;
                    this.startY = this.y;

                    const p1 = pointRefs.current[i];
                    const p2 = pointRefs.current[(i + 1) % pointRefs.current.length];

                    gsap.set([p1, p2], { x: `+=${dx}`, y: `+=${dy}` });
                    drawShape();
                },
            });
        });

        drawShape();
        window.addEventListener("resize", drawShape);

        return () => window.removeEventListener("resize", drawShape);
    }, [drawShape]);

    /* -----------------------------------------
       Render
    ----------------------------------------- */
    return (
        <div className="p-4 bg-gray-50 min-h-screen flex flex-col items-center">

            {/* Control Panel */}
            <div className="mb-6 p-4 bg-white rounded-xl shadow-lg space-y-3">
                <h3 className="font-semibold text-lg text-gray-700">Corner Radius</h3>

                {cornerRadius.map((r, i) => (
                    <div key={i} className="flex items-center space-x-3">
                        <label className="w-24 font-medium text-gray-700">
                            Corner {i + 1}: {(r*3.1416).toFixed(2)}
                        </label>

                        <input
                            type="range"
                            min="0"
                            max="300"
                            value={r}
                            onChange={(e) => {
                                const newR = [...cornerRadius];
                                newR[i] = Number(e.target.value);
                                setCornerRadius(newR);
                            }}
                            className="w-48"
                        />
                    </div>
                ))}
            </div>


            {/* Stage */}
            <div
                ref={stageRef}
                id="shape444"
                className=" w-full max-w-2xl border-4 border-dashed border-gray-300 rounded-xl shadow-inner relative"
                style={{ height: 500, overflow: "hidden", touchAction: "none" }}
            >
                <svg className="absolute top-0 left-0 w-full h-full pointer-events-none">
                   

                    <path
                        ref={shapeRef}
                        fill="black"
                        stroke="#1E3A8A"
                        strokeWidth="3"
                    />
                </svg>

                {/* Edge Length Labels */}
                {edgeLengths.map((len, i) => (
                    <div
                        key={i}
                        ref={(el) => (edgeTextRefs.current[i] = el)}
                        className="absolute text-blue-900 bg-white/90 px-2 py-1 rounded-full text-sm font-bold pointer-events-none shadow"
                    >
                        {String.fromCharCode(65 + i)}: {len.toFixed(1)} cm
                    </div>
                ))}

                {/* Draggable Points */}
                {points.current.map((p, i) => (
                    <div
                        key={i}
                        ref={(el) => (pointRefs.current[i] = el)}
                        className="absolute bg-white border-2 border-blue-900 rounded-full cursor-grab shadow"
                        style={{
                            width: 24,
                            height: 24,
                            top: p.y - 12,
                            left: p.x - 12,
                        }}
                    />
                ))}

                {/* Draggable Edges */}
                {points.current.map((_, i) => (
                    <div
                        key={i}
                        ref={(el) => (edgeRefs.current[i] = el)}
                        className="absolute bg-red-500 border border-red-800 rounded cursor-move"
                        style={{
                            width: 14,
                            height: 14,
                            transform: "translate(-50%, -50%)",
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default ShapePreview5;
