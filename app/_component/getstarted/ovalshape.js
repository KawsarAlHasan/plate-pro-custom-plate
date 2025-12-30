'use client';
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

export default function OvalShape() {
    const svgRef = useRef(null);
    const handleRef = useRef(null);
    const circleRef = useRef(null);
    const sta = useRef(null);

    const [radius, setRadius] = useState(45);
    useEffect(() => {
        const svg = svgRef.current;
        const handle = handleRef.current;

        const svgRect = svg.getBoundingClientRect();
        const centerX = svgRect.width / 2;
        const centerY = svgRect.height / 2;
        console.log(centerX, centerY);
        

        // Position handle according to initial radius
        const rPixels = (radius / 100) * Math.min(svgRect.width, svgRect.height);
        gsap.set(handle, { x: centerX , y: centerY });

        // Draggable handle
        Draggable.create(handle, {
            type: "x,y",
            onDrag() {
                const dx = this.x - centerX;
                const dy = this.y - centerY;

                const dist = Math.sqrt(dx * dx + dy * dy);

                // convert px → percentage
                const newRadius =
                    (dist / Math.min(svgRect.width, svgRect.height)) * 100;

                setRadius(newRadius);

                // Update circle radius in GSAP
                gsap.to(circleRef.current, {
                    attr: { r: `${newRadius}%` },
                    duration: 0.1,
                });
            },
        });
    }, []);

    return (
        <div className="border w-fit h-fit p-2">
            <svg
                ref={svgRef}
                width="300"
                height="300"
                viewBox="0 0 300 300"
                className="border bg-white"
            >
                {/* Main scalable circle */}
                <circle
                    ref={circleRef}
                    cx="50%"
                    cy="50%"
                    r={`${radius}%`}
                    fill="#BA0505"
                    stroke="yellow"
                    strokeWidth="8"
                />

                {/* draggable radius handle */}
                <circle
                    ref={handleRef}
                    r="10"
                    fill="blue"
                    stroke="#000"
                    strokeWidth="2"
                    style={{ cursor: "grab" }}
                />
            </svg>

            <div className="mt-2 font-semibold">
                Radius: {radius.toFixed(1)}cm
            </div>
        </div>
    );
}
