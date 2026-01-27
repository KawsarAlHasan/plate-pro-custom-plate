"use client";
import { Stage, Layer, Line, Circle, Text, Group } from "react-konva";
import { Card } from "antd";
import MainToolbar from "./MainToolbar";
import StatusBar from "./StatusBar";

function MainCanvasArea({
  setShapes,
  setHistoryIndex,
  historyIndex,
  history,
  scale,
  setScale,
  shapes,
  totalArea,
  totalPerimeter,
  calculateMeasurements,
  stageRef,
  stageSize,
  handleStageClick,
  handleShapeMouseMove,
  handleShapeMouseUp,
  gridVisible,
  renderGrid,
  previewArc,
  roundingPoints,
  getMidpoint,
  isDraggingMidpoint,
  getPerpendicularDirection,
  handleMidpointDragStart,
  handleMidpointDrag,
  handleMidpointDragEnd,
  dragOffset,
  setDrillingHoles,
  isPlacingHole,
  roundByDragActive,
  showMeasurements,
  handleShapeMouseDown,
  setSelectedShape,
  isPointSelectedForRounding,
  isDraggingShape,
  handlePointDrag,
  handlePointDragEnd,
  handlePointClick,
  addNewPoint,
  selectedShape,
  selectedPoint,
  toolMode,
  gridSize,
  moveIncrement,
  drillingHoles,
  unit,
}) {
  // Render preview arc
  const renderPreviewArc = () => {
    if (!previewArc || previewArc.points.length < 2) return null;
    const flatPoints = previewArc.points.flat();
    return (
      <Line
        points={flatPoints}
        stroke="#52c41a"
        strokeWidth={3 / scale}
        lineCap="round"
        lineJoin="round"
        dash={[8 / scale, 4 / scale]}
        listening={false}
      />
    );
  };

  // Render rounding midpoint
  const renderRoundingMidpoint = () => {
    if (!roundByDragActive || roundingPoints.length !== 2) return null;

    const shape = shapes[roundingPoints[0].shapeIndex];
    if (!shape) return null;

    const p1 = shape.points[roundingPoints[0].pointIndex];
    const p2 = shape.points[roundingPoints[1].pointIndex];
    const midpoint = getMidpoint(p1, p2);

    return (
      <Group>
        <Line
          points={[p1[0], p1[1], p2[0], p2[1]]}
          stroke="#ff4d4f"
          strokeWidth={2 / scale}
          dash={[5 / scale, 5 / scale]}
          listening={false}
        />

        {isDraggingMidpoint && (
          <Line
            points={[
              midpoint.x,
              midpoint.y,
              midpoint.x + getPerpendicularDirection(p1, p2).x * dragOffset,
              midpoint.y + getPerpendicularDirection(p1, p2).y * dragOffset,
            ]}
            stroke="#52c41a"
            strokeWidth={2 / scale}
            listening={false}
          />
        )}

        <Circle
          x={
            isDraggingMidpoint
              ? midpoint.x + getPerpendicularDirection(p1, p2).x * dragOffset
              : midpoint.x
          }
          y={
            isDraggingMidpoint
              ? midpoint.y + getPerpendicularDirection(p1, p2).y * dragOffset
              : midpoint.y
          }
          radius={12 / scale}
          fill="#52c41a"
          stroke="#ffffff"
          strokeWidth={3 / scale}
          draggable={true}
          onDragStart={handleMidpointDragStart}
          onDragMove={handleMidpointDrag}
          onDragEnd={handleMidpointDragEnd}
          onMouseEnter={(e) => {
            const container = e.target.getStage().container();
            container.style.cursor = "ns-resize";
          }}
          onMouseLeave={(e) => {
            const container = e.target.getStage().container();
            container.style.cursor = "default";
          }}
        />

        <Text
          x={midpoint.x + 15 / scale}
          y={midpoint.y - 10 / scale}
          text="Drag to Round"
          fontSize={12 / scale}
          fill="#52c41a"
          fontStyle="bold"
          listening={false}
        />

        {isDraggingMidpoint && Math.abs(dragOffset) > 5 && (
          <Text
            x={
              midpoint.x +
              getPerpendicularDirection(p1, p2).x * dragOffset +
              15 / scale
            }
            y={
              midpoint.y +
              getPerpendicularDirection(p1, p2).y * dragOffset -
              10 / scale
            }
            text={`${dragOffset > 0 ? "+" : ""}${dragOffset.toFixed(1)}mm`}
            fontSize={11 / scale}
            fill="#722ed1"
            fontStyle="bold"
            listening={false}
          />
        )}
      </Group>
    );
  };

  // Render drilling holes
  const renderDrillingHoles = () => {
    return drillingHoles.map((hole) => (
      <Group key={hole.id}>
        <Circle
          x={hole.x}
          y={hole.y}
          radius={hole.diameter * 2}
          fill="#ff4d4f"
          stroke="#ffffff"
          strokeWidth={2 / scale}
          draggable={toolMode === "select"}
          onDragEnd={(e) => {
            const newPos = e.target.position();
            setDrillingHoles(
              drillingHoles.map((h) =>
                h.id === hole.id ? { ...h, x: newPos.x, y: newPos.y } : h,
              ),
            );
          }}
        />
        <Circle
          x={hole.x}
          y={hole.y}
          radius={hole.diameter}
          fill="#ffffff"
          listening={false}
        />
        <Text
          x={hole.x + 15 / scale}
          y={hole.y - 8 / scale}
          text={`⌀${hole.diameter}mm`}
          fontSize={10 / scale}
          fill="#ff4d4f"
          fontStyle="bold"
          listening={false}
        />
      </Group>
    ));
  };

  // Calculate bounding box for selected shape
  const getSelectedShapeBoundingBox = () => {
    if (!selectedShape) return null;

    const shape = shapes.find((s) => s.id === selectedShape);
    if (!shape || !shape.points.length) return null;

    const xs = shape.points.map((p) => p[0]);
    const ys = shape.points.map((p) => p[1]);

    return {
      minX: Math.min(...xs),
      minY: Math.min(...ys),
      maxX: Math.max(...xs),
      maxY: Math.max(...ys),
    };
  };

  // Format distance based on unit (1 pixel = 1 mm)
  const formatDistance = (distanceInPixels) => {
    if (unit === "mm") {
      return `${distanceInPixels.toFixed(1)}mm`;
    } else {
      // Convert mm to cm
      return `${(distanceInPixels / 10).toFixed(2)}cm`;
    }
  };

  return (
    <div>
      <Card className="shadow-lg">
        <MainToolbar
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
        />

        <div
          className="border-2 border-gray-300 rounded-lg overflow-hidden bg-white"
          style={{ position: "relative" }}
        >
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={scale}
            scaleY={scale}
            onClick={handleStageClick}
            onMouseMove={handleShapeMouseMove}
            onMouseUp={handleShapeMouseUp}
          >
            <Layer>
              {gridVisible && renderGrid()}

              {shapes
                .filter((s) => s.visible)
                .map((shape, shapeIndex) => {
                  const isSelected = shape.id === selectedShape;
                  const isLocked = shape.locked;

                  return (
                    <Group key={shape.id}>
                      <Line
                        points={shape.points.flat()}
                        stroke={isSelected ? "#722ed1" : shape.color}
                        strokeWidth={(shape.strokeWidth || 2) / scale}
                        closed={shape.closed}
                        dash={isLocked ? [10 / scale, 5 / scale] : undefined}
                        fill={
                          shape.closed && isSelected
                            ? `${shape.color}20`
                            : undefined
                        }
                        onClick={(e) => {
                          if (!isLocked && toolMode === "select") {
                            setSelectedShape(shape.id);
                          }
                        }}
                        onTap={(e) => {
                          if (!isLocked && toolMode === "select") {
                            setSelectedShape(shape.id);
                          }
                        }}
                        onMouseDown={(e) => {
                          if (!isLocked && toolMode === "select") {
                            handleShapeMouseDown(e, shape.id);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (!isLocked && toolMode === "select") {
                            const container = e.target.getStage().container();
                            container.style.cursor = "move";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isDraggingShape) {
                            const container = e.target.getStage().container();
                            container.style.cursor = "default";
                          }
                        }}
                        listening={!isLocked}
                      />

                      {(isSelected || roundByDragActive) &&
                        !isLocked &&
                        shape.points.map((point, pointIndex) => {
                          const isPointSelected =
                            selectedPoint?.shapeIndex === shapeIndex &&
                            selectedPoint?.pointIndex === pointIndex;

                          const isSelectedForRounding =
                            isPointSelectedForRounding(shapeIndex, pointIndex);

                          const isDraggable = toolMode === "select";

                          let pointColor = "#722ed1";
                          if (isSelectedForRounding) {
                            pointColor = "#ff4d4f";
                          } else if (isPointSelected) {
                            pointColor = "#f5222d";
                          }

                          return (
                            <Group key={`${shape.id}-point-${pointIndex}`}>
                              <Circle
                                x={point[0]}
                                y={point[1]}
                                radius={
                                  isPointSelected || isSelectedForRounding
                                    ? 10 / scale
                                    : 8 / scale
                                }
                                fill={pointColor}
                                stroke="#ffffff"
                                strokeWidth={2 / scale}
                                draggable={isDraggable}
                                onDragMove={(e) => {
                                  if (isDraggable) {
                                    handlePointDrag(
                                      shapeIndex,
                                      pointIndex,
                                      e.target.position(),
                                    );
                                  }
                                }}
                                onDragEnd={() => {
                                  if (isDraggable) {
                                    handlePointDragEnd();
                                  }
                                }}
                                onMouseEnter={(e) => {
                                  const container = e.target
                                    .getStage()
                                    .container();
                                  if (toolMode === "delete-point") {
                                    container.style.cursor = "not-allowed";
                                  } else if (
                                    toolMode === "select-point" ||
                                    toolMode === "round-by-drag"
                                  ) {
                                    container.style.cursor = "pointer";
                                  } else if (toolMode === "select") {
                                    container.style.cursor = "move";
                                  } else {
                                    container.style.cursor = "default";
                                  }
                                }}
                                onMouseLeave={(e) => {
                                  const container = e.target
                                    .getStage()
                                    .container();
                                  container.style.cursor = "default";
                                }}
                                onClick={(e) =>
                                  handlePointClick(e, shapeIndex, pointIndex)
                                }
                              />
                              <Text
                                x={point[0] + 10 / scale}
                                y={point[1] - 15 / scale}
                                text={`${pointIndex + 1}`}
                                fontSize={10 / scale}
                                fill="#666"
                                listening={false}
                              />
                            </Group>
                          );
                        })}

                      {isSelected &&
                        !isLocked &&
                        toolMode === "add-point" &&
                        shape.points.map((point, segmentIndex) => {
                          if (
                            segmentIndex === shape.points.length - 1 &&
                            !shape.closed
                          )
                            return null;

                          const nextPoint =
                            shape.points[
                              (segmentIndex + 1) % shape.points.length
                            ];
                          const midX = (point[0] + nextPoint[0]) / 2;
                          const midY = (point[1] + nextPoint[1]) / 2;

                          return (
                            <Group key={`add-${segmentIndex}`}>
                              <Line
                                points={[...point, ...nextPoint]}
                                stroke="transparent"
                                strokeWidth={20 / scale}
                                onClick={(e) => {
                                  e.cancelBubble = true;
                                  const stage = e.target.getStage();
                                  const pos = stage.getPointerPosition();
                                  const transform = stage
                                    .getAbsoluteTransform()
                                    .copy()
                                    .invert();
                                  const relativePos = transform.point(pos);
                                  addNewPoint(
                                    shapeIndex,
                                    segmentIndex,
                                    relativePos,
                                  );
                                }}
                              />
                              <Circle
                                x={midX}
                                y={midY}
                                radius={6 / scale}
                                fill="#52c41a"
                                stroke="#ffffff"
                                strokeWidth={2 / scale}
                                opacity={0.7}
                                listening={false}
                              />
                            </Group>
                          );
                        })}

                      {/* Side measurements - 1 pixel = 1 mm */}
                      {showMeasurements &&
                        isSelected &&
                        shape.points.map((point, idx) => {
                          if (idx === shape.points.length - 1 && !shape.closed)
                            return null;

                          const nextPoint =
                            shape.points[(idx + 1) % shape.points.length];
                          const midX = (point[0] + nextPoint[0]) / 2;
                          const midY = (point[1] + nextPoint[1]) / 2;

                          // Distance in pixels = Distance in mm (since 1 pixel = 1 mm)
                          const distanceInMm = Math.sqrt(
                            Math.pow(nextPoint[0] - point[0], 2) +
                              Math.pow(nextPoint[1] - point[1], 2),
                          );

                          // Format based on selected unit
                          const displayText = formatDistance(distanceInMm);

                          return (
                            <Text
                              key={`measure-${idx}`}
                              x={midX}
                              y={midY - 15 / scale}
                              text={displayText}
                              fontSize={11 / scale}
                              fill="#000"
                              fontStyle="bold"
                              padding={4 / scale}
                              align="center"
                              listening={false}
                            />
                          );
                        })}
                    </Group>
                  );
                })}

              {renderPreviewArc()}
              {renderRoundingMidpoint()}
              {renderDrillingHoles()}

              {selectedShape && getSelectedShapeBoundingBox() && (
                <Line
                  points={[
                    getSelectedShapeBoundingBox().minX,
                    getSelectedShapeBoundingBox().minY,
                    getSelectedShapeBoundingBox().maxX,
                    getSelectedShapeBoundingBox().minY,
                    getSelectedShapeBoundingBox().maxX,
                    getSelectedShapeBoundingBox().maxY,
                    getSelectedShapeBoundingBox().minX,
                    getSelectedShapeBoundingBox().maxY,
                    getSelectedShapeBoundingBox().minX,
                    getSelectedShapeBoundingBox().minY,
                  ]}
                  stroke="#722ed1"
                  strokeWidth={1 / scale}
                  dash={[8 / scale, 4 / scale]}
                  listening={false}
                />
              )}

              {isPlacingHole && (
                <Text
                  x={stageSize.width / scale / 2 - 100}
                  y={20}
                  text="🎯 Click inside shape to place drilling hole"
                  fontSize={16 / scale}
                  fill="#ff4d4f"
                  fontStyle="bold"
                  listening={false}
                />
              )}
            </Layer>
          </Stage>
        </div>

        <StatusBar
          shapes={shapes}
          selectedShape={selectedShape}
          selectedPoint={selectedPoint}
          toolMode={toolMode}
          gridSize={gridSize}
          moveIncrement={moveIncrement}
          history={history}
          historyIndex={historyIndex}
        />
      </Card>
    </div>
  );
}

export default MainCanvasArea;
