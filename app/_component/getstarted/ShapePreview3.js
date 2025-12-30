'use client'
import React, { use, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";

gsap.registerPlugin(Draggable);

const ShapePreview3 = () => {
    const stageRef = useRef(null);
    const shapeRef = useRef(null);
    const pointRefs = useRef([]);
    const edgeRefs = useRef([]);

    // Refs for the new measurement labels
    const widthTopRef = useRef(null);
    const widthBottomRef = useRef(null);
    const heightLeftRef = useRef(null);
    const heightRightRef = useRef(null);
    const offsetTopRef = useRef(null);
    const offsetBottomRef = useRef(null);
    const offsetLeftRef = useRef(null);
    const offsetRightRef = useRef(null);

    // Initial shape points (a rectangle)
    const [points, setPoints] = useState([
        { x: 100, y: 100 },
        { x: 400, y: 100 },
        { x: 400, y: 300 },
        { x: 100, y: 300 },
    ]);

    const [cornerAngles, setCornerAngles] = useState([90, 90, 90, 90]);

    // State to hold calculated dimensions for display
    const [dimensions, setDimensions] = useState({
        shapeWidth: 0,
        shapeHeight: 0,
        offsetTop: 0,
        offsetBottom: 0,
        offsetLeft: 0,
        offsetRight: 0,
        stageWidth: 0,
        stageHeight: 0,
    });
    // ====get the corner angle========
    // Function to calculate angles at all corners
    const calculateCornerAngles = (points) => {
        const angles = points.map((point, i) => {
            const A = points[(i - 1 + points.length) % points.length];
            const B = point;
            const C = points[(i + 1) % points.length];


            const BA = { x: A.x - B.x, y: A.y - B.y };
            const BC = { x: C.x - B.x, y: C.y - B.y };


            const dot = BA.x * BC.x + BA.y * BC.y;
            const magBA = Math.sqrt(BA.x * BA.x + BA.y * BA.y);
            const magBC = Math.sqrt(BC.x * BC.x + BC.y * BC.y);


            const angleRad = Math.acos(dot / (magBA * magBC));
            const angleDeg = (angleRad * 180) / Math.PI;

            return angleDeg;
        });

        return angles;
    };



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

        // Determine min/max X/Y for the current shape to get its bounding box dimensions
        const minX = Math.min(...newPoints.map(p => p.x));
        const maxX = Math.max(...newPoints.map(p => p.x));
        const minY = Math.min(...newPoints.map(p => p.y));
        const maxY = Math.max(...newPoints.map(p => p.y));

        const shapeWidth = maxX - minX;
        const shapeHeight = maxY - minY;

        // Calculate offsets from the stage edges
        const currentOffsetTop = minY;
        const currentOffsetBottom = stageRect.height - maxY;
        const currentOffsetLeft = minX;
        const currentOffsetRight = stageRect.width - maxX;

        // Update SVG path
        const path =
            newPoints.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") +
            " Z";
        shapeRef.current.setAttribute("d", path);
        const newCornerAngles = calculateCornerAngles(newPoints);
        setCornerAngles(newCornerAngles);
        console.log("Corner angles:", newCornerAngles);

        // Update state for dimensions
        setDimensions({
            shapeWidth,
            shapeHeight,
            offsetTop: currentOffsetTop,
            offsetBottom: currentOffsetBottom,
            offsetLeft: currentOffsetLeft,
            offsetRight: currentOffsetRight,
            stageWidth: stageRect.width,
            stageHeight: stageRect.height,
        });

        // --- Position all measurement labels ---

        // Shape Width Labels (Top & Bottom)
        if (widthTopRef.current) {
            gsap.set(widthTopRef.current, {
                x: minX + shapeWidth / 2,
                y: minY - 40,
                xPercent: -60,
                yPercent: -20
            });
        }
        if (widthBottomRef.current) {
            gsap.set(widthBottomRef.current, {
                x: minX + shapeWidth / 2,
                y: maxY + 20,
                xPercent: -60,
                yPercent: -50
            });
        }

        // Shape Height Labels (Left & Right)
        if (heightLeftRef.current) {
            gsap.set(heightLeftRef.current, {
                x: minX - 40,
                y: minY + shapeHeight / 2,
                xPercent: -40,
                yPercent: -85,
                rotate: -90,
            });
        }
        if (heightRightRef.current) {
            gsap.set(heightRightRef.current, {
                x: maxX + 20,
                y: minY + shapeHeight / 2,
                xPercent: -60,
                yPercent: -85,
                rotate: 90,
            });
        }


        // --- Position draggable edge handles (unchanged) ---
        edgeRefs.current.forEach((edge, i) => {
            const p1 = newPoints[i];
            const p2 = newPoints[(i + 1) % newPoints.length];
            const midX = (p1.x + p2.x) / 2;
            const midY = (p1.y + p2.y) / 2;
            gsap.set(edge, { x: midX, y: midY });
        });
    };

    // === Initialize Draggable points + edges ===
    useEffect(() => {
        if (!stageRef.current) return;

        // -----Cleanup: Kill old Draggable instances----
        gsap.utils.toArray([...pointRefs.current, ...edgeRefs.current]).forEach(
            (el) => Draggable.get(el)?.kill()
        );

        // --- Draggable corners ---
        pointRefs.current.forEach((el) => {
            Draggable.create(el, {
                type: "x,y",
                bounds: stageRef.current,
                onDrag: drawShape,
                onPress: drawShape,
                onRelease: drawShape,
            });
        });

        // --- Draggable edges (for translation) ---
        edgeRefs.current.forEach((edge, i) => {
            Draggable.create(edge, {
                type: "x,y",
                bounds: stageRef.current,
                onPress() {
                    this.startX = this.x;
                    this.startY = this.y;
                },
                onDrag() {
                    const dx = this.x - this.startX;
                    const dy = this.y - this.startY;
                    this.startX = this.x;
                    this.startY = this.y;

                    const el1 = pointRefs.current[i];
                    const el2 = pointRefs.current[(i + 1) % pointRefs.current.length];

                    gsap.set([el1, el2], {
                        x: `+=${dx}`,
                        y: `+=${dy}`,
                    });

                    drawShape();
                },
            });
        });

        // Initial draw
        drawShape();

    }, [points.length]);


    return (
        <div
            ref={stageRef}
            style={{
                width: "100%",
                height: "100%",
                minHeight: "400px",
                position: "relative",
                overflow: "hidden",
                padding: "10px",
            }}
        >
            

            {/* SVG Shape Layer */}
            <svg
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
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
                    fill="#333"
                    stroke="#888"
                    strokeWidth="5"
                />
            </svg>

            {/* --- Dynamic Measurement Labels --- */}

            {/* Inner Shape Width - Top */}
            <MeasurementLabel ref={widthTopRef}>
                {dimensions.shapeWidth.toFixed(0)} cm
            </MeasurementLabel>
            {/* Inner Shape Width - Bottom */}
            <MeasurementLabel ref={widthBottomRef}>
                {dimensions.shapeWidth.toFixed(0)} cm
            </MeasurementLabel>
            {/* Inner Shape Height - Left */}
            <MeasurementLabel ref={heightLeftRef}>
                {dimensions.shapeHeight.toFixed(0)} cm
            </MeasurementLabel>
            {/* Inner Shape Height - Right */}
            <MeasurementLabel ref={heightRightRef}>
                {dimensions.shapeHeight.toFixed(0)} cm
            </MeasurementLabel>

            

            {/* Draggable Edges (line midpoints) - Styling to match your image */}
            {points.map((_, i) => (
                <div
                    key={`edge-${i}`}
                    ref={(el) => (edgeRefs.current[i] = el)}
                    style={{
                        position: "absolute",
                        width: "10px",
                        height: "10px",
                        background: "rgba(255, 0, 0, 0.5)",
                        border: "1px solid red",
                        borderRadius: "2px",
                        cursor: "move",
                        touchAction: "none",
                        top: 0,
                        left: 0,
                        transform: "translate(-50%,-50%)", // Center handle
                        zIndex: 3,
                        ...(i === 2 && {
                            background: "red",
                            border: "1px solid darkred"
                        })
                    }}
                ></div>
            ))}

            {/* Draggable Corners */}
            {points.map((p, i) => (
                <div
                    key={`point-container-${i}`}
                    style={{
                        position: "absolute",
                        top: p.y,
                        left: p.x,
                        transform: "translate(-50%, -50%)",
                        zIndex: 5,
                    }}
                >
                    <div
                        ref={(el) => (pointRefs.current[i] = el)}
                        style={{
                            width: "10px",
                            height: "10px",
                            background: "yellow",
                            border: "2px solid red",
                            borderRadius: "50%",
                            cursor: "grab",
                            touchAction: "none",
                            transform: "translate(0, 0)",
                            position: "relative",
                        }}
                    >
                        {/* Optional: Display corner angle */}
                        <div className={`corner_angle_${i}`}>

                            {cornerAngles[i].toFixed(0)}°
                            
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Simple MeasurementLabel component for consistent styling and ref forwarding
const MeasurementLabel = React.forwardRef(({ children, isOffsetLabel }, ref) => (
    <div
        className="lengthIndicator"
        ref={ref}
        style={{
            position: "absolute",
            color: isOffsetLabel ? "#007bff" : "#333", // Blue for offsets, dark for dimensions
            backgroundColor: isOffsetLabel ? "rgba(200, 230, 255, 0.7)" : "rgba(255, 255, 255, 0.8)",
            padding: "2px 6px",
            borderRadius: "3px",
            fontSize: "11px",
            fontWeight: "600",
            pointerEvents: "none", // Ignore clicks/drags
            transform: "translate(0,0)", // GSAP will control this
            whiteSpace: "nowrap",
            zIndex: 2,
        }}
    >
        {children}
    </div>
));

export default ShapePreview3;