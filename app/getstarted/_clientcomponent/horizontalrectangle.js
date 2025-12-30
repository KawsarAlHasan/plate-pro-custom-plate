'use client'
import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

export default function ProportionalRectangle() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const widthHandleRef = useRef(null);
  const heightHandleRef = useRef(null);

  // Base width and height (state controls visual SVG size)
  const [dimensions, setDimensions] = useState({ width: 305, height: 355 });

  // Keep original ratio (recalculated each render — stays consistent)
  const ratio = dimensions.height / dimensions.width;

  // Mutable base dimensions used during dragging (doesn't cause re-renders)
  const baseDimensions = useRef({ width: 305, height: 355 });

  // Constant viewBox internal size
  const SVG_INNER_WIDTH = 300;
  const SVG_INNER_HEIGHT = SVG_INNER_WIDTH * ratio;

  const updateHandles = () => {
    if (!svgRef.current || !widthHandleRef.current || !heightHandleRef.current || !containerRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const containerRect = containerRef.current.getBoundingClientRect();
    const handleSize = 6;

    // ======vertical (width)======
    widthHandleRef.current.style.left = rect.right - containerRect.left - (handleSize / 2) + 'px';
    widthHandleRef.current.style.top = rect.top - containerRect.top + 'px';
    widthHandleRef.current.style.height = rect.height + 'px';

    // =====horizontal (height)=====
    heightHandleRef.current.style.left = rect.left - containerRect.left + 'px';
    heightHandleRef.current.style.top = rect.bottom - containerRect.top - (handleSize / 2) + 'px';
    heightHandleRef.current.style.width = rect.width + 'px';
  };


  useEffect(() => {
    updateHandles();
  }, [dimensions]);

  useEffect(() => {
    if (!widthHandleRef.current || !heightHandleRef.current) return;

    const MIN_SIZE = 50; 

    const widthDraggable = Draggable.create(widthHandleRef.current, {
      type: 'x',
      onDrag() {
        // compute new width based on base + drag delta
        let newWidth = baseDimensions.current.width + this.x;
        if (newWidth < MIN_SIZE) newWidth = MIN_SIZE;
        const newHeight = newWidth * ratio;
        setDimensions({ width: newWidth, height: newHeight });
      },
      onDragEnd() {
        let finalWidth = baseDimensions.current.width + this.x;
        if (finalWidth < MIN_SIZE) finalWidth = MIN_SIZE;
        const finalHeight = finalWidth * ratio;
        // ======commit to base========
        baseDimensions.current.width = finalWidth;
        baseDimensions.current.height = finalHeight;
        // ======visually reset handle transform to zero====
        gsap.to(this.target, { x: 0, duration: 0.15 });
      }
    })[0];

    //===== Height draggable (vertical)==========
    const heightDraggable = Draggable.create(heightHandleRef.current, {
      type: 'y',
      onDrag() {
        let newHeight = baseDimensions.current.height + this.y;
        if (newHeight < MIN_SIZE) newHeight = MIN_SIZE;
        const newWidth = newHeight / ratio;
        setDimensions({ width: newWidth, height: newHeight });
      },
      onDragEnd() {
        let finalHeight = baseDimensions.current.height + this.y;
        if (finalHeight < MIN_SIZE) finalHeight = MIN_SIZE;
        const finalWidth = finalHeight / ratio;
        baseDimensions.current.width = finalWidth;
        baseDimensions.current.height = finalHeight;
        gsap.to(this.target, { y: 0, duration: 0.15 });
      }
    })[0];


    const onResize = () => {
      updateHandles();
    };
    window.addEventListener('resize', onResize);

    updateHandles();

    return () => {
      window.removeEventListener('resize', onResize);
      widthDraggable && widthDraggable.kill();
      heightDraggable && heightDraggable.kill();
    };
    
  }, [ratio]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-screen flex justify-center items-center bg-gray-200"
    >
      {/* =====Live dimensions========== */}
      <div className="absolute top-4 left-4 bg-white p-3 rounded shadow-lg z-10">
        <p><strong>Width:</strong> {dimensions.width.toFixed(0)} px</p>
        <p><strong>Height:</strong> {dimensions.height.toFixed(0)} px</p>
        <p><strong>Ratio:</strong> {ratio.toFixed(2)}</p>
      </div>

      {/* =====SVG Rectangle========== */}
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        viewBox={`0 0 ${SVG_INNER_WIDTH} ${SVG_INNER_HEIGHT}`}
        className="shadow-2xl"
        style={{ display: 'block' }}
      >
        <rect width={SVG_INNER_WIDTH} height={SVG_INNER_HEIGHT} fill="black" />
      </svg>

  {/* ========widthHandleRef========= */}
      <div
        ref={widthHandleRef}
        style={{
          width: '6px',
          background: 'rgb(29, 78, 216)',
          cursor: 'ew-resize',
          position: 'absolute',
          zIndex: 20,
          touchAction: 'none',
        }}
      ></div>

  {/* ===========widthHandleRef============ */}
      <div
        ref={heightHandleRef}
        style={{
          height: '6px',
          background: 'rgb(29, 78, 216)',
          cursor: 'ns-resize',
          position: 'absolute',
          zIndex: 20,
          touchAction: 'none',
        }}
      ></div>
    </div>
  );
}
