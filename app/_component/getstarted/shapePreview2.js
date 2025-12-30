'use client'
import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

const ShapePreview2 = () => {
    const stageRef = useRef(null);
    const stageInnerRef = useRef(null);
    const shapeRef = useRef(null);
    const pointRefs = useRef([]);
    const edgeRefs = useRef([]);
    const edgeTextRefs = useRef([]);
    // ===points position===
    const [points, setPoints] = useState([
        { x: 50, y: 100 },
        { x: 250, y: 100 },
        { x: 250, y: 250 },
        { x: 50, y: 250 },
    ]);
    const [edgeLengths, setEdgeLengths] = useState([]);

    // Pan/zoom state in refs (mutating—avoids re-render storm)
    const pan = useRef({ x: 0, y: 0 });
    const scale = useRef(1);
    const isPanning = useRef(false);
    const lastPointer = useRef({ x: 0, y: 0 });

    // Apply transform to stageInner
    const applyTransform = () => {
        if (!stageInnerRef.current) return;
        gsap.set(stageInnerRef.current, {
            x: pan.current.x,
            y: pan.current.y,
            scale: scale.current,
            transformOrigin: "0 0",
        });
    };

    // Convert screen coords to local stage coordinates (account for pan & scale)
    const screenToStage = (screenX, screenY) => {
        const stageRect = stageRef.current.getBoundingClientRect();
        // center point already included in caller; compute local coordinates:
        const localX = (screenX - stageRect.left - pan.current.x) / scale.current;
        const localY = (screenY - stageRect.top - pan.current.y) / scale.current;
        return { x: localX, y: localY };
    };

    const drawShape = () => {
        if (!stageRef.current) return;
        // Read current positions of points (they are inside stageInner so screen rect must be transformed)
        const stageRect = stageRef.current.getBoundingClientRect();

        const newPoints = pointRefs.current.map((el) => {
            const rect = el.getBoundingClientRect();
            const centerScreenX = rect.left + rect.width / 2;
            const centerScreenY = rect.top + rect.height / 2;
            // Convert to stage-local coordinates (undo pan & scale)
            const { x, y } = screenToStage(centerScreenX, centerScreenY);

            return { x, y };
        });

        // Build path in stage-local coords
        const path =
            newPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") +
            " Z";

        if (shapeRef.current) shapeRef.current.setAttribute("d", path);

        const lengths = [];
        // Update edges and labels (edgeRefs are positioned in stageInner; set their transformed positions accordingly)
        edgeRefs.current.forEach((edge, i) => {
            const p1 = newPoints[i];
            const p2 = newPoints[(i + 1) % newPoints.length];

            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            lengths.push(length);

            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;

            // Compute label offset (same logic you had)
            const isHorizontalEdge = i % 2 === 0;
            const OFFSET_DISTANCE = 30;

            let offsetX = 0,
                offsetY = 0,
                rotation = 0;

            if (isHorizontalEdge) {
                rotation = 0;
                offsetY = i === 0 ? -OFFSET_DISTANCE : OFFSET_DISTANCE;
            } else {
                rotation = 90;
                offsetX = i === 1 ? OFFSET_DISTANCE : -OFFSET_DISTANCE;
            }

            // Because edgeRefs are inside stageInner and stageInner is transformed,
            // set them in stage-local coordinates (GSAP will apply transform inside container)
            if (edge) gsap.set(edge, { x: midX, y: midY });

            if (edgeTextRefs.current[i]) {
                gsap.set(edgeTextRefs.current[i], {
                    x: midX + offsetX,
                    y: midY + offsetY,
                    xPercent: -50,
                    yPercent: -50,
                    rotation,
                });
            }
        });

        setEdgeLengths(lengths);
    };
    // Init draggables for edges + initial point positions
    useEffect(() => {
        if (!stageRef.current) return;

        // Kill old draggables
        gsap.utils.toArray([...pointRefs.current, ...edgeRefs.current]).forEach(
            (el) => Draggable.get(el)?.kill()
        );

        // Set initial positions inside stageInner (stage-local coords)
        points.forEach((p, i) => {
            if (pointRefs.current[i])
                gsap.set(pointRefs.current[i], { x: p.x - 9, y: p.y - 9 });
        });

        // Setup draggable edges (existing logic)
        edgeRefs.current.forEach((edge, i) => {
            Draggable.create(edge, {
                type: "x,y",
                bounds: stageRef.current,
                onPress() {
                    this.startX = this.x;
                    this.startY = this.y;
                    this.isHorizontalEdge = i % 2 === 0;
                },
                onDrag() {
                    const dx = this.x - this.startX;
                    const dy = this.y - this.startY;

                    let moveX = 0;
                    let moveY = 0;

                    if (this.isHorizontalEdge) {
                        moveY = dy;
                        this.update({ x: this.startX, y: this.y });
                    } else {
                        moveX = dx;
                        this.update({ x: this.x, y: this.startY });
                    }

                    const el1 = pointRefs.current[i];
                    const el2 = pointRefs.current[(i + 1) % pointRefs.current.length];

                    gsap.set([el1, el2], {
                        x: `+=${moveX}`,
                        y: `+=${moveY}`,
                    });

                    drawShape();

                    this.startX = this.x;
                    this.startY = this.y;
                },
            });
        });

        // Ensure transforms applied
        applyTransform();
        drawShape();
    }, [points.length]);

    // --------------------
    // PANNING (background drag)
    // --------------------
    // useEffect(() => {
    //     const stage = stageRef.current;
    //     if (!stage) return;

    //     const onPointerDown = (e) => {
    //         if (e.target !== stage && e.target !== stageInnerRef.current) return;

    //         isPanning.current = true;
    //         lastPointer.current = { x: e.clientX, y: e.clientY };

    //         e.preventDefault();
    //     };

    //     const onPointerMove = (e) => {
    //         if (!isPanning.current) return;
    //         const dx = e.clientX - lastPointer.current.x;
    //         const dy = e.clientY - lastPointer.current.y;
    //         lastPointer.current = { x: e.clientX, y: e.clientY };

    //         pan.current.x += dx;
    //         pan.current.y += dy;
    //         applyTransform();
    //         drawShape();
    //     };

    //     const onPointerUp = () => {
    //         isPanning.current = false;
    //     };

    //     stage.addEventListener("pointerdown", onPointerDown);
    //     window.addEventListener("pointermove", onPointerMove);
    //     window.addEventListener("pointerup", onPointerUp);
    //     window.addEventListener("pointercancel", onPointerUp);

    //     return () => {
    //         stage.removeEventListener("pointerdown", onPointerDown);
    //         window.removeEventListener("pointermove", onPointerMove);
    //         window.removeEventListener("pointerup", onPointerUp);
    //         window.removeEventListener("pointercancel", onPointerUp);
    //     };
    // }, []);

    useEffect(() => {
    const stage = stageRef.current;
    const inner = stageInnerRef.current;
    if (!stage || !inner) return;

    const onPointerDown = (e) => {
        // allow panning when clicking:
        // <svg>, <path>, or stageInner background
        const allowedTargets = ["svg", "path", "DIV"];

        const tag = e.target.tagName.toLowerCase();
        if (!allowedTargets.includes(tag)) return;

        isPanning.current = true;
        lastPointer.current = { x: e.clientX, y: e.clientY };

        e.preventDefault();
    };

    const onPointerMove = (e) => {
        if (!isPanning.current) return;

        const dx = e.clientX - lastPointer.current.x;
        const dy = e.clientY - lastPointer.current.y;

        lastPointer.current = { x: e.clientX, y: e.clientY };

        pan.current.x += dx;
        pan.current.y += dy;

        applyTransform();
        drawShape();
    };

    const onPointerUp = () => {
        isPanning.current = false;
    };

    stage.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
        stage.removeEventListener("pointerdown", onPointerDown);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
    };
}, []);

    // --------------------
    // WHEEL ZOOM (center on mouse)
    // --------------------
    useEffect(() => {
        const stage = stageRef.current;
        if (!stage) return;

        const MIN_SCALE = 0.3;
        const MAX_SCALE = 3;

        const onWheel = (e) => {
            e.preventDefault();
            const rect = stage.getBoundingClientRect();
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            const before = screenToStage(mouseX, mouseY);

            // zoom factor
            const delta = -e.deltaY;
            const zoomFactor = 1 + (delta > 0 ? 0.08 : -0.08);
            let newScale = clamp(scale.current * zoomFactor, MIN_SCALE, MAX_SCALE);
            const factor = newScale / scale.current;
            scale.current = newScale;


            const mouseScreenX = mouseX;
            const mouseScreenY = mouseY;
            const panXnew =
                mouseScreenX - rect.left - before.x * scale.current;
            const panYnew =
                mouseScreenY - rect.top - before.y * scale.current;

            pan.current.x = panXnew;
            pan.current.y = panYnew;

            applyTransform();
            drawShape(); 
        };

        stage.addEventListener("wheel", onWheel, { passive: false });
        return () => stage.removeEventListener("wheel", onWheel);
    }, []);

    return (
        <div
            ref={stageRef}
            style={{
                width: "100%",
                height: "700px",
                position: "relative",
                overflow: "hidden",
                padding: "10px",
                background: "transparent",
                touchAction: "none",
            }}
        >
            {/* stageInner is the element that we translate+scale */}
            <div
                ref={stageInnerRef}
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    transformOrigin: "0 0",
                    border: "1px solid red"
                }}
            >
                <svg
                    // ref={stageInnerRef}
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
                        stroke="#1e3a8a"
                        strokeWidth="5"
                    />
                </svg>

                {/* Edge Length Labels (A, B, C, D) */}
                {edgeLengths.map((length, i) => (
                    <div
                        key={`length-label-${i}`}
                        ref={(el) => (edgeTextRefs.current[i] = el)}
                        className="lengthIndicator"
                        style={{
                            position: "absolute",
                            color: "#B91C1C",
                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                            padding: "2px 5px",
                            borderRadius: "3px",
                            fontSize: "12px",
                            fontWeight: "600",
                            pointerEvents: "none",
                            zIndex: 4,
                        }}
                    >

                         {length.toFixed(1)} cm
                    </div>
                ))}

                {/* Point anchors */}
                {points.map((p, i) => (
                    <div
                        key={`point-${i}`}
                        ref={(el) => (pointRefs.current[i] = el)}
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "18px",
                            height: "18px",
                            background: "#fff",
                            border: "2px solid #1e3a8a",
                            borderRadius: "50%",
                            cursor: "default",
                            touchAction: "none",
                            transform: "translate(0, 0)",
                            zIndex: 5,
                        }}
                    ></div>
                ))}

                {/* Draggable Edges */}
                {points.map((_, i) => (
                    <div
                        key={`edge-${i}`}
                        ref={(el) => (edgeRefs.current[i] = el)}
                        className="edge"
                        style={{
                            position: "absolute",
                            top: "5px",
                            left: "5px",
                            width: "20px",
                            height: "20px",
                            background: "#1e3a8a",
                            border: "2px solid #fff",
                            borderRadius: "4px",
                            cursor: "move",
                            touchAction: "none",
                            transform: "translate(-50%,-50%)",
                            zIndex: 6,
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ShapePreview2;
