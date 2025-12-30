'use client'
import { useRouter } from "next/navigation";
import React, { useState, useRef, useEffect, useCallback } from "react";


const generateSvgPath = (width, height, radius) => {
  const w = parseFloat(width);
  const h = parseFloat(height);
  const r = Math.min(parseFloat(radius), w / 2, h / 2); 
  const pathData = `
    M 0,${r} 
    A ${r},${r} 0 0,1 ${r},0 
    L ${w - r},0 
    A ${r},${r} 0 0,1 ${w},${r} 
    L ${w},${h} 
    L 0,${h} 
    Z
  `;

  // The complete SVG element as a string to be stored and passed
  const svgString = `
    <svg 
      width="${w.toFixed(0)}" 
      height="${h.toFixed(0)}" 
      viewBox="0 0 ${w} ${h}" 
      xmlns="http://www.w3.org/2000/svg"
      fill="black"
    >
      <path d="${pathData.trim()}"/>
    </svg>
  `;
  return { pathData: pathData.trim(), svgString: svgString.trim() };
};


export default function ResizableRoundedShape() {
  const router = useRouter();
  const boxRef = useRef(null);
  const [size, setSize] = useState({ width: 300, height: 200 });
  const [radius, setRadius] = useState(50);
  const [resizeSide, setResizeSide] = useState(null);
  const [isRounding, setIsRounding] = useState(false);

  // =========================
  // Width / Height Resizing
  // =========================
  useEffect(() => {
    const handleMove = (e) => {
      if (!resizeSide) return;
      const rect = boxRef.current.getBoundingClientRect();

      if (resizeSide === "right") {
        const newWidth = Math.max(80, e.clientX - rect.left);
        setSize((prev) => ({ ...prev, width: newWidth }));
      }

      if (resizeSide === "bottom") {
        const newHeight = Math.max(50, e.clientY - rect.top);
        setSize((prev) => ({ ...prev, height: newHeight }));
      }
    };

    const stopResize = () => setResizeSide(null);

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, [resizeSide]);

  // =========================
  // Top-Rounding Control
  // =========================
  useEffect(() => {
    const handleRound = (e) => {
      if (!isRounding) return;
      const rect = boxRef.current.getBoundingClientRect();
      const diff = e.clientY - rect.top;
      // Limit radius to be between 0 and half the smaller dimension
      const maxRadius = Math.min(size.height / 2, size.width / 2);
      const newRadius = Math.max(0, Math.min(diff, maxRadius));
      setRadius(newRadius);
    };

    const stopRound = () => setIsRounding(false);

    window.addEventListener("mousemove", handleRound);
    window.addEventListener("mouseup", stopRound);

    return () => {
      window.removeEventListener("mousemove", handleRound);
      window.removeEventListener("mouseup", stopRound);
    };
  }, [isRounding, size.height, size.width]);
  
  // --- Save function ---
  const handleSaveShape = useCallback(() => {
    const { svgString } = generateSvgPath(size.width, size.height, radius);
    localStorage.setItem('customShapeSvg', svgString);
    const dimensions = { width: size.width, height: size.height, radius: radius };
    localStorage.setItem('customShapeDimensions', JSON.stringify(dimensions));
    router.push('/previewandsummar');
  }, [size.width, size.height, radius]);

  // Calculate path data for live rendering
  const { pathData } = generateSvgPath(size.width, size.height, radius);

  return (
    <div className="w-full h-fit flex flex-col justify-center items-center bg-gray-200 relative">

      <svg
        ref={boxRef}
        width={size.width}
        height={size.height}
        viewBox={`0 0 ${size.width} ${size.height}`}
        style={{
          transition: resizeSide || isRounding ? "none" : "0.2s",
        }}
        className="relative shadow-lg"
      >
        <path 
          d={pathData} 
          fill="black" 
        />

        {/* Top-Round Handle */}
        <foreignObject 
          x={size.width / 2 - 10} // Center X, adjust by handle width/2
          y={10} 
          width="20" 
          height="50"
          style={{ overflow: 'visible' }}
        >
            <div
                onMouseDown={() => setIsRounding(true)}
                className="w-5 h-5 bg-red-500/50 rounded-full cursor-pointer relative" 
            >
                <div className="absolute top-5 left-1/2 -translate-x-1/2 w-fit h-fit bg-white text-black text-center text-sm rounded-md px-2">
                    {radius.toFixed(0)}
                </div>
            </div>
        </foreignObject>

        {/* Right Resize Handle (Width) */}
        <foreignObject 
            x={size.width - 15} 
            y={size.height / 2 - 10} 
            width="15" 
            height="30"
            style={{ overflow: 'visible' }}
        >
            <div
                onMouseDown={() => setResizeSide("right")}
                className="w-3 h-5 bg-red-500/50 cursor-ew-resize relative"
            >
                <div className="absolute top-1/2 -left-12 w-fit h-fit bg-white text-black text-center text-sm rounded-md px-2">
                    {size.height.toFixed(0)}
                </div>
            </div>
        </foreignObject>

        {/* Bottom Resize Handle (Height) */}
        <foreignObject 
            x={0} 
            y={size.height - 15} 
            width={size.width} 
            height="15"
            style={{ overflow: 'visible' }}
        >
            <div
                onMouseDown={() => setResizeSide("bottom")}
                className="w-full h-3 bg-red-500/50 cursor-ns-resize relative"
            >
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-fit h-fit bg-white text-black text-center text-sm rounded-md px-2">
                    {size.width.toFixed(0)}
                </div>
            </div>
        </foreignObject>

      </svg>

      <div className=" flex p-3 rounded shadow-lg z-10">
        {/* <p><strong>Width:</strong> {size.width.toFixed(0)} px</p>
        <p><strong>Height:</strong> {size.height.toFixed(0)} px</p>
        <p><strong>Top Radius:</strong> {radius.toFixed(0)} px</p> */}
        <button
          onClick={handleSaveShape}
          className="mt-3 w-fit p-2  bg-black text-white rounded hover:bg-blue-600 transition"
        >
          Save & Proceed to Checkout
        </button>
      </div>
    </div>
  );
}