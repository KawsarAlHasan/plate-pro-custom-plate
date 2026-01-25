"use client";
import { useState, useRef, useEffect } from "react";
import { Line } from "react-konva";
import { Button, message } from "antd";
import { produce } from "immer";
import ShapeTemplate from "./ShapeTemplate";
import { useShapeList, useMaterialList } from "../api/shapeListApi";
import { useRouter, useSearchParams } from "next/navigation";
import LeftSidebar from "./_shapeComponents/LeftSidebar";
import OrderConfirmation from "./_shapeComponents/OrderConfirmation";
import MainCanvasArea from "./_shapeComponents/_mainCanvasArea/MainCanvasArea";
import { fetcherWithTokenPostFormData } from "../api/api";
import { showToast } from "nextjs-toast-notify";

const DxfEditor = () => {
  const searchParams = useSearchParams();
  const shapeId = searchParams.get("shapeId");

  const { shapeList, isLoading, isError, mutate } = useShapeList();
  const { materialList, isLoading: isMaterialLoading } = useMaterialList();

  const router = useRouter();

  // State Management
  const [showShapeTemplate, setShowShapeTemplate] = useState(false);
  const [shapes, setShapes] = useState([]);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedShape, setSelectedShape] = useState(null);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [totalArea, setTotalArea] = useState(0);
  const [totalPerimeter, setTotalPerimeter] = useState(0);
  const [scale, setScale] = useState(1);
  const [gridVisible, setGridVisible] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);
  const [showMeasurements, setShowMeasurements] = useState(true);
  const [stageSize, setStageSize] = useState({ width: 1200, height: 800 });
  const [toolMode, setToolMode] = useState("select");
  const [gridSize, setGridSize] = useState(0.5);
  const [moveIncrement, setMoveIncrement] = useState(0.5);
  const [unit, setUnit] = useState("mm"); // mm or cm

  // Shape dragging state
  const [isDraggingShape, setIsDraggingShape] = useState(false);
  const [dragStartPos, setDragStartPos] = useState(null);

  // Drilling Holes State
  const [drillingHoles, setDrillingHoles] = useState([]);
  const [isPlacingHole, setIsPlacingHole] = useState(false);

  // Corner Settings State
  const [cornerSettings, setCornerSettings] = useState({});

  // Material & Pricing State
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedFinish, setSelectedFinish] = useState(null);

  // Round by Drag State
  const [roundByDragActive, setRoundByDragActive] = useState(false);
  const [roundingPoints, setRoundingPoints] = useState([]);
  const [isDraggingMidpoint, setIsDraggingMidpoint] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [previewArc, setPreviewArc] = useState(null);

  // Validation State
  const [validationErrors, setValidationErrors] = useState([]);
  const [showValidationModal, setShowValidationModal] = useState(false);

  // Current Step (for multi-step form)
  const [currentStep, setCurrentStep] = useState(1);

  // Refs
  const stageRef = useRef();
  const containerRef = useRef();

  useEffect(() => {
    if (!shapeList || !shapeId) return;

    // shapeId string → number
    const selectedShape = shapeList.find(
      (shape) => shape.id === Number(shapeId),
    );

    if (!selectedShape) return;

    const formattedShape = {
      id: `shape-${selectedShape.id}`,
      type: "polygon",
      points: selectedShape.points,
      color: "#1890ff",
      strokeWidth: 2,
      closed: selectedShape.closed,
      visible: true,
      locked: false,
      name: selectedShape.name,
      originalData: selectedShape, // Store original shape data
    };

    const shapesArray = [formattedShape];

    setSelectedShape(`shape-${selectedShape.id}`);

    setShapes(shapesArray);
    updateHistory(shapesArray);
    calculateMeasurements(shapesArray);

    // corner settings initialize
    const initialCornerSettings = {};
    formattedShape.points.forEach((_, idx) => {
      initialCornerSettings[idx] = { type: "sharp", radius: 0 };
    });
    setCornerSettings(initialCornerSettings);

    setSelectedPoint(null);
  }, [shapeId, shapeList]);

  // Handle window resize
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setStageSize((prev) => ({ ...prev, width: Math.max(800, width - 40) }));
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Clear selected point when tool mode changes
  useEffect(() => {
    if (toolMode !== "select-point" && toolMode !== "round-by-drag") {
      setSelectedPoint(null);
    }
    if (toolMode !== "round-by-drag") {
      setRoundByDragActive(false);
      setRoundingPoints([]);
      setIsDraggingMidpoint(false);
      setDragOffset(0);
      setPreviewArc(null);
    }
    if (toolMode !== "place-hole") {
      setIsPlacingHole(false);
    }
  }, [toolMode]);

  // Toggle Round by Drag mode
  const toggleRoundByDrag = () => {
    if (roundByDragActive) {
      setRoundByDragActive(false);
      setRoundingPoints([]);
      setIsDraggingMidpoint(false);
      setDragOffset(0);
      setPreviewArc(null);
      setToolMode("select");
    } else {
      setRoundByDragActive(true);
      setToolMode("round-by-drag");
      setRoundingPoints([]);
      setSelectedPoint(null);
    }
  };

  // Update History
  const updateHistory = (newShapes) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newShapes)));
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // ============= Shape Dragging Functions =============
  const handleShapeMouseDown = (e, shapeId) => {
    if (toolMode !== "select" && toolMode !== "move-shape") return;

    e.cancelBubble = true;
    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    const relativePos = transform.point(pointerPos);

    setIsDraggingShape(true);
    setDragStartPos(relativePos);
    setSelectedShape(shapeId);
  };

  const handleShapeMouseMove = (e) => {
    if (!isDraggingShape || !dragStartPos || !selectedShape) return;

    const stage = e.target.getStage();
    const pointerPos = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    const currentPos = transform.point(pointerPos);

    const dx = currentPos.x - dragStartPos.x;
    const dy = currentPos.y - dragStartPos.y;

    const updatedShapes = produce(shapes, (draft) => {
      const shapeIndex = draft.findIndex((s) => s.id === selectedShape);
      if (shapeIndex !== -1) {
        draft[shapeIndex].points = draft[shapeIndex].points.map((point) => [
          point[0] + dx,
          point[1] + dy,
        ]);
      }
    });

    setShapes(updatedShapes);
    setDragStartPos(currentPos);
  };

  const handleShapeMouseUp = () => {
    if (isDraggingShape) {
      setIsDraggingShape(false);
      setDragStartPos(null);
      updateHistory(shapes);
      calculateMeasurements(shapes);
    }
  };

  // Drag Points with custom grid snap
  const handlePointDrag = (shapeIndex, pointIndex, newPos) => {
    const updatedShapes = produce(shapes, (draft) => {
      let { x, y } = newPos;

      if (snapToGrid) {
        const snapSize = gridSize * 12;
        x = Math.round(x / snapSize) * snapSize;
        y = Math.round(y / snapSize) * snapSize;
      }

      draft[shapeIndex].points[pointIndex] = [x, y];
    });
    setShapes(updatedShapes);
  };

  const handlePointDragEnd = () => {
    updateHistory(shapes);
    calculateMeasurements(shapes);
  };

  // Move point with arrow keys
  const movePoint = (shapeIndex, pointIndex, direction) => {
    if (!selectedPoint) return;
    const updatedShapes = produce(shapes, (draft) => {
      const point = draft[shapeIndex].points[pointIndex];
      const movePixels = moveIncrement * 12;
      switch (direction) {
        case "up":
          point[1] -= movePixels;
          break;
        case "down":
          point[1] += movePixels;
          break;
        case "left":
          point[0] -= movePixels;
          break;
        case "right":
          point[0] += movePixels;
          break;
      }
    });
    updateShapes(updatedShapes);
  };

  // Add New Point to Line
  const addNewPoint = (shapeIndex, segmentIndex, position) => {
    const updatedShapes = produce(shapes, (draft) => {
      const shape = draft[shapeIndex];
      let { x, y } = position;

      if (snapToGrid) {
        const snapSize = gridSize * 12;
        x = Math.round(x / snapSize) * snapSize;
        y = Math.round(y / snapSize) * snapSize;
      }

      shape.points.splice(segmentIndex + 1, 0, [x, y]);
    });
    updateShapes(updatedShapes);

    // Update corner settings
    const newCornerSettings = { ...cornerSettings };
    newCornerSettings[Object.keys(newCornerSettings).length] = {
      type: "sharp",
      radius: 0,
    };
    setCornerSettings(newCornerSettings);

    message.success("New point added");
  };

  // Delete Point
  const deletePoint = (shapeIndex, pointIndex) => {
    const shape = shapes[shapeIndex];

    if (shape.points.length <= 3) {
      message.warning("Cannot delete point - minimum 3 points required");
      return;
    }

    const updatedShapes = produce(shapes, (draft) => {
      draft[shapeIndex].points.splice(pointIndex, 1);
    });
    updateShapes(updatedShapes);

    // Update corner settings
    const newCornerSettings = {};
    Object.keys(cornerSettings).forEach((key, idx) => {
      if (parseInt(key) !== pointIndex) {
        const newKey =
          parseInt(key) > pointIndex ? parseInt(key) - 1 : parseInt(key);
        newCornerSettings[newKey] = cornerSettings[key];
      }
    });
    setCornerSettings(newCornerSettings);

    message.success("Point deleted");
  };

  // Calculate Area and Perimeter
  const calculateMeasurements = (shapeList) => {
    let totalArea = 0;
    let totalPerimeter = 0;

    shapeList.forEach((shape) => {
      if (shape.visible && shape.points.length >= 3) {
        if (shape.closed) {
          const area = Math.abs(getPolygonArea(shape.points));
          totalArea += area;
        }
        const perimeter = getPolygonPerimeter(shape.points, shape.closed);
        totalPerimeter += perimeter;
      }
    });
    const areaSquareMeter = totalArea / 144;
    const perimeterSquareMerer = totalPerimeter / 12;

    setTotalArea(areaSquareMeter);
    setTotalPerimeter(perimeterSquareMerer);
  };

  const getPolygonArea = (points) => {
    let area = 0;
    const n = points.length;

    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      area += points[i][0] * points[j][1];
      area -= points[j][0] * points[i][1];
    }

    return Math.abs(area / 2);
  };

  const getPolygonPerimeter = (points, closed) => {
    let perimeter = 0;

    for (let i = 0; i < points.length - 1; i++) {
      const dx = points[i + 1][0] - points[i][0];
      const dy = points[i + 1][1] - points[i][1];
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    if (closed && points.length > 2) {
      const dx = points[0][0] - points[points.length - 1][0];
      const dy = points[0][1] - points[points.length - 1][1];
      perimeter += Math.sqrt(dx * dx + dy * dy);
    }

    return perimeter;
  };

  // Update Shapes Helper
  const updateShapes = (newShapes) => {
    setShapes(newShapes);
    updateHistory(newShapes);
    calculateMeasurements(newShapes);
  };

  // Auto-Square: Make all angles 90 degrees
  const autoSquare = () => {
    if (shapes.length === 0) {
      message.warning("No shapes to square");
      return;
    }

    const updatedShapes = produce(shapes, (draft) => {
      draft.forEach((shape) => {
        if (shape.points.length >= 4 && shape.closed) {
          const points = shape.points;
          const minX = Math.min(...points.map((p) => p[0]));
          const maxX = Math.max(...points.map((p) => p[0]));
          const minY = Math.min(...points.map((p) => p[1]));
          const maxY = Math.max(...points.map((p) => p[1]));

          // Create a rectangle from bounding box
          shape.points = [
            [minX, minY],
            [maxX, minY],
            [maxX, maxY],
            [minX, maxY],
          ];
        }
      });
    });

    updateShapes(updatedShapes);
    message.success("Shape squared to 90° corners");
  };

  // Grid Generator
  const renderGrid = () => {
    const gridSizePixels = gridSize * 12;
    const gridLines = [];
    const width = stageSize.width / scale;
    const height = stageSize.height / scale;

    for (let i = 0; i < width; i += gridSizePixels) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, height]}
          stroke="#e0e0e0"
          strokeWidth={0.5 / scale}
          listening={false}
        />,
      );
    }

    for (let i = 0; i < height; i += gridSizePixels) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, width, i]}
          stroke="#e0e0e0"
          strokeWidth={0.5 / scale}
          listening={false}
        />,
      );
    }

    return gridLines;
  };

  // ============== ROUND BY DRAG FUNCTIONS ==============
  const getMidpoint = (p1, p2) => {
    return {
      x: (p1[0] + p2[0]) / 2,
      y: (p1[1] + p2[1]) / 2,
    };
  };

  const getDistance = (p1, p2) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getPerpendicularDirection = (p1, p2) => {
    const dx = p2[0] - p1[0];
    const dy = p2[1] - p1[1];
    const length = Math.sqrt(dx * dx + dy * dy);
    return {
      x: -dy / length,
      y: dx / length,
    };
  };

  const calculateArcPoints = (p1, p2, dragDistance, numSegments = 20) => {
    if (Math.abs(dragDistance) < 1) {
      return [p1, p2];
    }

    const midpoint = getMidpoint(p1, p2);
    const d = getDistance(p1, p2);
    const h = Math.abs(dragDistance);

    const maxH = d / 2 - 1;
    const clampedH = Math.min(h, maxH);

    if (clampedH < 1) {
      return [p1, p2];
    }

    const radius = clampedH / 2 + (d * d) / (8 * clampedH);
    const perp = getPerpendicularDirection(p1, p2);
    const direction = dragDistance > 0 ? 1 : -1;

    const centerX = midpoint.x + perp.x * (radius - clampedH) * direction;
    const centerY = midpoint.y + perp.y * (radius - clampedH) * direction;

    const startAngle = Math.atan2(p1[1] - centerY, p1[0] - centerX);
    const endAngle = Math.atan2(p2[1] - centerY, p2[0] - centerX);

    const arcPoints = [];

    let angleDiff = endAngle - startAngle;

    if (direction > 0) {
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    } else {
      if (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
      if (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    }

    for (let i = 0; i <= numSegments; i++) {
      const t = i / numSegments;
      const angle = startAngle + angleDiff * t;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      arcPoints.push([x, y]);
    }

    return arcPoints;
  };

  const handleRoundingPointClick = (e, shapeIndex, pointIndex) => {
    e.cancelBubble = true;

    if (!roundByDragActive) return;

    const shape = shapes[shapeIndex];
    if (!shape) return;

    const existingIndex = roundingPoints.findIndex(
      (rp) => rp.shapeIndex === shapeIndex && rp.pointIndex === pointIndex,
    );

    if (existingIndex !== -1) {
      const newPoints = [...roundingPoints];
      newPoints.splice(existingIndex, 1);
      setRoundingPoints(newPoints);
      return;
    }

    if (
      roundingPoints.length > 0 &&
      roundingPoints[0].shapeIndex !== shapeIndex
    ) {
      message.warning("Please select points from the same shape");
      return;
    }

    if (roundingPoints.length < 2) {
      const newPoints = [...roundingPoints, { shapeIndex, pointIndex }];
      setRoundingPoints(newPoints);

      if (newPoints.length === 2) {
        const idx1 = newPoints[0].pointIndex;
        const idx2 = newPoints[1].pointIndex;
        const numPoints = shape.points.length;

        const isAdjacent =
          Math.abs(idx1 - idx2) === 1 ||
          (shape.closed &&
            ((idx1 === 0 && idx2 === numPoints - 1) ||
              (idx2 === 0 && idx1 === numPoints - 1)));

        if (!isAdjacent) {
          message.warning("Please select two adjacent points");
          setRoundingPoints([]);
          return;
        }

        message.info("Drag the midpoint to create a round");
      }
    }
  };

  const handleMidpointDragStart = (e) => {
    e.cancelBubble = true;
    setIsDraggingMidpoint(true);
    setDragOffset(0);
  };

  const handleMidpointDrag = (e) => {
    if (!isDraggingMidpoint || roundingPoints.length !== 2) return;

    const shape = shapes[roundingPoints[0].shapeIndex];
    const p1 = shape.points[roundingPoints[0].pointIndex];
    const p2 = shape.points[roundingPoints[1].pointIndex];
    const midpoint = getMidpoint(p1, p2);
    const perp = getPerpendicularDirection(p1, p2);

    const pos = e.target.position();

    const dx = pos.x - midpoint.x;
    const dy = pos.y - midpoint.y;
    const projectedDistance = dx * perp.x + dy * perp.y;

    setDragOffset(projectedDistance);

    const arcPoints = calculateArcPoints(p1, p2, projectedDistance);
    setPreviewArc({
      points: arcPoints,
      shapeIndex: roundingPoints[0].shapeIndex,
    });
  };

  const handleMidpointDragEnd = () => {
    if (
      !isDraggingMidpoint ||
      roundingPoints.length !== 2 ||
      Math.abs(dragOffset) < 5
    ) {
      setIsDraggingMidpoint(false);
      setDragOffset(0);
      setPreviewArc(null);
      return;
    }

    const shape = shapes[roundingPoints[0].shapeIndex];
    const p1 = shape.points[roundingPoints[0].pointIndex];
    const p2 = shape.points[roundingPoints[1].pointIndex];

    const arcPoints = calculateArcPoints(p1, p2, dragOffset, 16);

    const updatedShapes = produce(shapes, (draft) => {
      const shapeToUpdate = draft[roundingPoints[0].shapeIndex];
      const idx1 = roundingPoints[0].pointIndex;
      const idx2 = roundingPoints[1].pointIndex;

      const minIdx = Math.min(idx1, idx2);
      const maxIdx = Math.max(idx1, idx2);

      if (
        shape.closed &&
        minIdx === 0 &&
        maxIdx === shapeToUpdate.points.length - 1
      ) {
        const newPoints = [
          ...arcPoints.slice(1, -1),
          ...shapeToUpdate.points.slice(1, -1),
        ];
        shapeToUpdate.points =
          newPoints.length >= 3 ? newPoints : shapeToUpdate.points;
      } else {
        const newPoints = [
          ...shapeToUpdate.points.slice(0, minIdx + 1),
          ...arcPoints.slice(1, -1),
          ...shapeToUpdate.points.slice(maxIdx),
        ];
        shapeToUpdate.points = newPoints;
      }
    });

    updateShapes(updatedShapes);
    message.success("Round applied successfully!");

    setIsDraggingMidpoint(false);
    setDragOffset(0);
    setPreviewArc(null);
    setRoundingPoints([]);
  };

  // Handle point click based on tool mode
  const handlePointClick = (e, shapeIndex, pointIndex) => {
    e.cancelBubble = true;

    if (toolMode === "round-by-drag") {
      handleRoundingPointClick(e, shapeIndex, pointIndex);
    } else if (toolMode === "delete-point") {
      deletePoint(shapeIndex, pointIndex);
    } else if (toolMode === "select-point") {
      if (
        selectedPoint?.shapeIndex === shapeIndex &&
        selectedPoint?.pointIndex === pointIndex
      ) {
        setSelectedPoint(null);
      } else {
        setSelectedPoint({ shapeIndex, pointIndex });
      }
    }
  };

  const isPointSelectedForRounding = (shapeIndex, pointIndex) => {
    return roundingPoints.some(
      (rp) => rp.shapeIndex === shapeIndex && rp.pointIndex === pointIndex,
    );
  };

  // Handle stage click for placing drilling holes
  const handleStageClick = (e) => {
    if (!isPlacingHole) return;

    const stage = e.target.getStage();
    const pos = stage.getPointerPosition();
    const transform = stage.getAbsoluteTransform().copy().invert();
    const relativePos = transform.point(pos);

    // Check if click is inside any shape
    const isInsideShape = shapes.some((shape) => {
      if (!shape.closed || !shape.visible) return false;
      return isPointInPolygon(relativePos, shape.points);
    });

    if (!isInsideShape) {
      message.warning("Drilling hole must be placed inside the shape");
      return;
    }

    const newHole = {
      id: `hole-${Date.now()}`,
      x: relativePos.x,
      y: relativePos.y,
      diameter: 6, // Fixed 6mm diameter
    };

    setDrillingHoles([...drillingHoles, newHole]);
    message.success("Drilling hole placed");

    if (drillingHoles.length >= 1) {
      setIsPlacingHole(false);
      setToolMode("select");
    }
  };

  // Point in polygon check
  const isPointInPolygon = (point, polygon) => {
    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0],
        yi = polygon[i][1];
      const xj = polygon[j][0],
        yj = polygon[j][1];

      if (
        yi > point.y !== yj > point.y &&
        point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi
      ) {
        inside = !inside;
      }
    }
    return inside;
  };

  // Validation
  const validateOrder = () => {
    const errors = [];

    // Check if shapes exist
    if (shapes.length === 0) {
      errors.push("No shape defined. Please draw or upload a shape.");
    }

    // Check drilling holes (minimum 2 required)
    if (drillingHoles.length < 2) {
      errors.push(
        `Minimum 2 drilling holes required. Currently: ${drillingHoles.length}`,
      );
    }

    // Check material selection
    if (!selectedMaterial) {
      errors.push("Please select a material.");
    }

    // Check thickness
    if (!selectedThickness) {
      errors.push("Please select a thickness.");
    }

    // Check color
    if (!selectedColor) {
      errors.push("Please select a color or request a special color.");
    }

    // Check for invalid corners (radius intersection)
    const shape = shapes[0];
    if (shape) {
      for (let i = 0; i < shape.points.length; i++) {
        const corner = cornerSettings[i];
        if (corner && corner.type === "radius" && corner.radius > 0) {
          const prevIdx = (i - 1 + shape.points.length) % shape.points.length;
          const nextIdx = (i + 1) % shape.points.length;

          const distPrev = getDistance(shape.points[i], shape.points[prevIdx]);
          const distNext = getDistance(shape.points[i], shape.points[nextIdx]);

          if (
            corner.radius * 12 > distPrev / 2 ||
            corner.radius * 12 > distNext / 2
          ) {
            errors.push(
              `Corner ${i + 1} radius is too large for the adjacent edges.`,
            );
          }
        }
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  // Export canvas image
  const exportCanvasImage = () => {
    if (!stageRef.current) return null;

    const stage = stageRef.current.getStage();

    // Convert the stage to a data URL
    const pixelRatio = 2;
    const dataURL = stage.toDataURL({
      pixelRatio,
      mimeType: "image/png",
      quality: 0.95,
    });

    return dataURL;
  };

  // Helper function to convert dataURL to File
  const dataURLToFile = (dataURL, filename) => {
    const arr = dataURL.split(",");
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };

  const handleSubmitOrder = async () => {
    if (!validateOrder()) {
      message.error("Please fix validation errors before submitting");
      return;
    }

    // Get material and thickness details
    const materialData = materialList?.find((m) => m.id === selectedMaterial);
    const thicknessData = materialData?.variants?.find(
      (v) => v.id === selectedThickness,
    );

    // Calculate total price
    const basePrice = parseFloat(thicknessData?.price || 0);
    const totalPrice = basePrice * totalArea;

    try {
      // Step 1: Export canvas as image
      const canvasImage = exportCanvasImage();
      let imageFile = null;

      if (canvasImage) {
        imageFile = dataURLToFile(canvasImage, `design-${Date.now()}.png`);
      }

      // Step 2: Create main order
      const orderFormData = new FormData();
      orderFormData.append("tatalArea", Math.round(totalArea));
      orderFormData.append("totalPerimeter", Math.round(totalPerimeter));
      orderFormData.append("material", materialData?.id || "");
      orderFormData.append("thickness", thicknessData?.id || "");
      orderFormData.append("color", selectedColor || "");
      orderFormData.append("totalDrilingHoles", drillingHoles.length);
      orderFormData.append("total_price", Math.round(totalPrice));

      // Optional: Add finish if exists
      if (selectedFinish) {
        orderFormData.append("finish", selectedFinish);
      }

      // Add the canvas image to main order if needed
      if (imageFile) {
        orderFormData.append("design_preview", imageFile);
      }

      const orderResponse = await fetcherWithTokenPostFormData(
        "/api/services/order-plates/create/",
        orderFormData,
      );

      // Step 3: Create order items (shapes)
      if (!orderResponse?.id) {
        throw new Error("Order ID not found in response");
      }

      const itemsPromises = shapes.map(async (shape, index) => {
        const itemsFormData = new FormData();

        // Append order ID
        itemsFormData.append("order", orderResponse.id);

        // Append shape data
        itemsFormData.append(
          "name",
          shape.originalData?.name || `Shape ${index + 1}`,
        );

        // Append the same image for all shapes (or create individual images if needed)
        if (imageFile) {
          // Create a new File with shape-specific name
          const shapeImageFile = new File(
            [imageFile],
            `shape_${index + 1}_${Date.now()}.png`,
            { type: "image/png" },
          );
          itemsFormData.append("icon", shapeImageFile);
        }

        itemsFormData.append(
          "description",
          shape.originalData?.description || "",
        );
        itemsFormData.append("points", JSON.stringify(shape.points));

        // Append drilling holes
        itemsFormData.append(
          "drillingHole",
          JSON.stringify(drillingHoles.map((h) => [h.x, h.y])),
        );

        itemsFormData.append(
          "closed",
          shape.originalData?.closed?.toString() || "true",
        );
        itemsFormData.append(
          "is_active",
          shape.originalData?.is_active?.toString() || "true",
        );

        // Optional: Add variants if exists
        if (shape.originalData?.variants) {
          itemsFormData.append(
            "variants",
            JSON.stringify(shape.originalData.variants),
          );
        }

        return fetcherWithTokenPostFormData(
          "/api/services/order-plates/items/",
          itemsFormData,
        );
      });

      // Create all order items
      await Promise.all(itemsPromises);

      // Show success message
      showToast.success("Order submitted successfully!");

      // Redirect to orders page
      setTimeout(() => {
        router.push("/orders");
      }, 1500);
    } catch (error) {
      console.error("Error submitting order:", error);

      // User-friendly error message
      let errorMessage = "Failed to submit order. Please try again.";
      if (error.response?.data) {
        const apiError = error.response.data;
        if (typeof apiError === "object") {
          errorMessage = Object.values(apiError).flat().join(", ");
        } else {
          errorMessage = apiError.toString();
        }
      }

      message.error(errorMessage);
    } finally {
      // Close modal
      setShowValidationModal(false);
    }
  };

  return (
    <div
      className={
        showShapeTemplate ? "grid grid-cols-7 gap-1" : "grid grid-cols-6 gap-1"
      }
    >
      {showShapeTemplate && (
        <div className="col-span-1">
          <ShapeTemplate
            shapeList={shapeList}
            isLoading={isLoading}
            isError={isError}
            mutate={mutate}
          />
        </div>
      )}

      <div className="col-span-6">
        <div className="gap-6 p-4 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
          <div className="grid grid-cols-12 gap-6">
            {/* Left Sidebar */}
            <LeftSidebar
              showShapeTemplate={showShapeTemplate}
              setShowShapeTemplate={setShowShapeTemplate}
              stageRef={stageRef}
              currentStep={currentStep}
              setCurrentStep={setCurrentStep}
              setShowValidationModal={setShowValidationModal}
              toolMode={toolMode}
              setToolMode={setToolMode}
              roundByDragActive={roundByDragActive}
              toggleRoundByDrag={toggleRoundByDrag}
              autoSquare={autoSquare}
              roundingPoints={roundingPoints}
              shapes={shapes}
              updateShapes={updateShapes}
              selectedShape={selectedShape}
              setSelectedShape={setSelectedShape}
              selectedPoint={selectedPoint}
              setSelectedPoint={setSelectedPoint}
              movePoint={movePoint}
              deletePoint={deletePoint}
              moveIncrement={moveIncrement}
              setMoveIncrement={setMoveIncrement}
              unit={unit}
              setUnit={setUnit}
              gridSize={gridSize}
              setGridSize={setGridSize}
              gridVisible={gridVisible}
              setGridVisible={setGridVisible}
              snapToGrid={snapToGrid}
              setSnapToGrid={setSnapToGrid}
              showMeasurements={showMeasurements}
              setShowMeasurements={setShowMeasurements}
              drillingHoles={drillingHoles}
              setDrillingHoles={setDrillingHoles}
              isPlacingHole={isPlacingHole}
              setIsPlacingHole={setIsPlacingHole}
              selectedMaterial={selectedMaterial}
              setSelectedMaterial={setSelectedMaterial}
              selectedThickness={selectedThickness}
              setSelectedThickness={setSelectedThickness}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedFinish={selectedFinish}
              setSelectedFinish={setSelectedFinish}
              validationErrors={validationErrors}
              validateOrder={validateOrder}
              totalArea={totalArea}
              totalPerimeter={totalPerimeter}
              materialList={materialList}
              isMaterialLoading={isMaterialLoading}
            />

            {/* Main Canvas Area */}
            <div
              className={showShapeTemplate ? "col-span-8" : "col-span-9"}
              ref={containerRef}
            >
              <MainCanvasArea
                setShapes={setShapes}
                setHistoryIndex={setHistoryIndex}
                historyIndex={historyIndex}
                history={history}
                scale={scale}
                setScale={setScale}
                shapes={shapes}
                totalArea={totalArea}
                totalPerimeter={totalPerimeter}
                calculateMeasurements={calculateMeasurements}
                stageRef={stageRef}
                stageSize={stageSize}
                handleStageClick={handleStageClick}
                handleShapeMouseMove={handleShapeMouseMove}
                handleShapeMouseUp={handleShapeMouseUp}
                gridVisible={gridVisible}
                renderGrid={renderGrid}
                previewArc={previewArc}
                roundingPoints={roundingPoints}
                getMidpoint={getMidpoint}
                isDraggingMidpoint={isDraggingMidpoint}
                getPerpendicularDirection={getPerpendicularDirection}
                handleMidpointDragStart={handleMidpointDragStart}
                handleMidpointDrag={handleMidpointDrag}
                handleMidpointDragEnd={handleMidpointDragEnd}
                dragOffset={dragOffset}
                setDrillingHoles={setDrillingHoles}
                isPlacingHole={isPlacingHole}
                roundByDragActive={roundByDragActive}
                showMeasurements={showMeasurements}
                handleShapeMouseDown={handleShapeMouseDown}
                setSelectedShape={setSelectedShape}
                isPointSelectedForRounding={isPointSelectedForRounding}
                isDraggingShape={isDraggingShape}
                handlePointDrag={handlePointDrag}
                handlePointDragEnd={handlePointDragEnd}
                handlePointClick={handlePointClick}
                addNewPoint={addNewPoint}
                selectedShape={selectedShape}
                selectedPoint={selectedPoint}
                toolMode={toolMode}
                gridSize={gridSize}
                moveIncrement={moveIncrement}
                drillingHoles={drillingHoles}
                unit={unit}
              />
            </div>
          </div>

          {/* Order Confirmation Modal */}
          <OrderConfirmation
            showValidationModal={showValidationModal}
            setShowValidationModal={setShowValidationModal}
            totalArea={totalArea}
            totalPerimeter={totalPerimeter}
            drillingHoles={drillingHoles}
            selectedMaterial={selectedMaterial}
            selectedThickness={selectedThickness}
            selectedColor={selectedColor}
            selectedFinish={selectedFinish}
            materialList={materialList}
            handleSubmitOrder={handleSubmitOrder}
            validationErrors={validationErrors}
          />
        </div>
      </div>
    </div>
  );
};

export default DxfEditor;
