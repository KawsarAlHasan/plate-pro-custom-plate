'use client';
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default function ShapeTwo() {
  const stageRef = useRef(null);
  const shapeRef = useRef(null);
  const pointRefs = useRef([]);
  const [points, setPoints] = useState([
    { x: 100, y: 100 },
    { x: 300, y: 80 },
    { x: 340, y: 220 },
    { x: 120, y: 250 },
  ]);

  /** Draw polygon path */
  const drawShape = () => {
    if (!stageRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();

    const newPoints = pointRefs.current.map((el) => {
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left - stageRect.left + rect.width / 2,
        y: rect.top - stageRect.top + rect.height / 2,
      };
    });

    const path = newPoints
      .map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`)
      .join(" ") + " Z";

    gsap.to(shapeRef.current, {
      attr: { d: path },
      duration: 0.2,
      ease: "power2.out",
    });
  };

  /** Initialize drag points */
  useEffect(() => {
    if (!stageRef.current) return;

    // Reset refs to prevent stale references
    pointRefs.current = pointRefs.current.slice(0, points.length);

    // Destroy old draggables
    pointRefs.current.forEach((el) => {
      if (el?._gsap) Draggable.get(el)?.kill();
    });

    const draggables = pointRefs.current.map((el, i) => {
      // Set initial transform so GSAP uses (x,y)
      gsap.set(el, { x: points[i].x - 9, y: points[i].y - 9 });

      return Draggable.create(el, {
        type: "x,y",
        bounds: stageRef.current,
        inertia: false,
        onDrag: drawShape,
        onPress: drawShape,
        onRelease: drawShape,
        cursor: "grabbing",
      })[0];
    });

    drawShape();

    return () => draggables.forEach((d) => d.kill());
  }, [points]);

  /** Add/remove points */
  const addPoint = () => {
    const rect = stageRef.current.getBoundingClientRect();
    setPoints([...points, { x: rect.width / 2, y: rect.height / 2 }]);
  };

  const removePoint = () => {
    if (points.length > 3) setPoints(points.slice(0, -1));
  };

  return (
    <div
      ref={stageRef}
      style={{
        width: "100%",
        height: "500px",
        position: "relative",
        background: "#f1f5f9",
        border: "2px dashed #94a3b8",
        borderRadius: "12px",
        overflow: "hidden",
        padding: "10px",
      }}
    >
      <svg
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
        <path
          ref={shapeRef}
          fill="url(#grad)"
          stroke="#334155"
          strokeWidth="2"
        />
      </svg>

      {points.map((p, i) => (
        <div
          key={i}
          ref={(el) => (pointRefs.current[i] = el)}
          style={{
            position: "absolute",
            width: "18px",
            height: "18px",
            background: "#fff",
            border: "2px solid #1e3a8a",
            borderRadius: "50%",
            cursor: "grab",
            touchAction: "none",
            boxShadow: "0 0 4px rgba(0,0,0,0.2)",
            // Top/left removed. GSAP sets x,y
          }}
        />
      ))}

      <div
        style={{
          position: "absolute",
          bottom: "15px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "10px",
        }}
      >
        <button
          onClick={addPoint}
          style={{
            padding: "8px 16px",
            background: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ➕ Add Point
        </button>
        <button
          onClick={removePoint}
          style={{
            padding: "8px 16px",
            background: "#ef4444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: "600",
          }}
        >
          ➖ Remove Point
        </button>
      </div>
    </div>
  );
}
