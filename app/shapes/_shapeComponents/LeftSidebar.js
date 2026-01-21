"use client";
import {
  Button,
  Card,
  Divider,
  Space,
  Tooltip,
  Alert,
  InputNumber,
  message,
} from "antd";
import {
  PlusOutlined,
  DragOutlined,
  DeleteOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  ArrowLeftOutlined,
  ArrowRightOutlined,
  AimOutlined,
  RadiusSettingOutlined,
  BorderOutlined,
} from "@ant-design/icons";
import StepIndicator from "./_leftSidebar/StepIndicator";
import Settings from "./_leftSidebar/Settings";
import ShapeProperties from "./_leftSidebar/ShapeProperties";
import DrillingHoles from "./_leftSidebar/DrillingHoles";
import MaterialSelector from "./_leftSidebar/MaterialSelector";
import PricingPanel from "./_leftSidebar/PricingPanel";
import DimensionInput from "./_leftSidebar/DimensionInput";
import ValidationPanel from "./_leftSidebar/ValidationPanel";

function LeftSidebar({
  /* Steps */
  currentStep,
  setCurrentStep,
  setShowValidationModal,

  /* Tools */
  toolMode,
  setToolMode,
  roundByDragActive,
  toggleRoundByDrag,
  autoSquare,
  roundingPoints,

  /* Shapes & points */
  shapes,
  updateShapes,
  selectedShape,
  setSelectedShape,
  selectedPoint,
  setSelectedPoint,
  movePoint,
  deletePoint,

  /* Precision movement */
  moveIncrement,
  setMoveIncrement,

  /* Units & dimensions */
  unit,
  setUnit,

  /* Grid & settings */
  gridSize,
  setGridSize,
  gridVisible,
  setGridVisible,
  snapToGrid,
  setSnapToGrid,
  showMeasurements,
  setShowMeasurements,

  /* Drilling holes */
  drillingHoles,
  setDrillingHoles,
  isPlacingHole,
  setIsPlacingHole,

  /* Material selection */
  selectedMaterial,
  setSelectedMaterial,
  selectedThickness,
  setSelectedThickness,
  selectedColor,
  setSelectedColor,
  specialColorRequest,
  setSpecialColorRequest,

  /* Validation & pricing */
  validationErrors,
  validateOrder,
  totalArea,
  totalPerimeter,
}) {
  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1 && shapes.length === 0) {
      message.warning("Please draw or upload a shape first");
      return;
    }
    if (currentStep === 2 && drillingHoles.length < 2) {
      message.warning("Please add at least 2 drilling holes");
      return;
    }
    if (currentStep === 3 && (!selectedMaterial || !selectedThickness)) {
      message.warning("Please select material and thickness");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final validation
      if (validateOrder()) {
        setShowValidationModal(true);
      } else {
        message.error("Please fix validation errors before submitting");
      }
    }
  };

  return (
    <div className="col-span-4 space-y-4 overflow-y-auto max-h-screen">
      {/* Step Indicator */}
      <StepIndicator
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />

      {/* Step 1: Shape Drawing */}
      {currentStep === 1 && (
        <>
          {/* Editing Tools */}
          <Card title="🛠️ Drawing Tools" size="small" className="shadow-md">
            <Space orientation="vertical" className="w-full" size="small">
              <div className="grid grid-cols-4 gap-2">
                <Tooltip title="Move Shape (Drag entire shape)">
                  <Button
                    type={toolMode === "select" ? "primary" : "default"}
                    icon={<DragOutlined />}
                    onClick={() => setToolMode("select")}
                    style={{ height: 40 }}
                  >
                    Move
                  </Button>
                </Tooltip>
                <Tooltip title="Select Point">
                  <Button
                    type={toolMode === "select-point" ? "primary" : "default"}
                    icon={<AimOutlined />}
                    onClick={() => setToolMode("select-point")}
                    style={{ height: 40 }}
                  >
                    Point
                  </Button>
                </Tooltip>
                <Tooltip title="Add Point">
                  <Button
                    type={toolMode === "add-point" ? "primary" : "default"}
                    icon={<PlusOutlined />}
                    onClick={() => setToolMode("add-point")}
                    style={{ height: 40 }}
                  >
                    Add
                  </Button>
                </Tooltip>
                <Tooltip title="Delete Point">
                  <Button
                    type={toolMode === "delete-point" ? "primary" : "default"}
                    icon={<DeleteOutlined />}
                    onClick={() => setToolMode("delete-point")}
                    style={{ height: 40 }}
                  >
                    Delete
                  </Button>
                </Tooltip>
              </div>

              {toolMode === "select" && (
                <Alert
                  type="info"
                  title="🖐️ Click and drag the shape to move it"
                  showIcon
                />
              )}

              <Divider style={{ margin: "8px 0" }}>Rounding</Divider>
              <Tooltip title="Round by Drag">
                <Button
                  type={roundByDragActive ? "primary" : "default"}
                  icon={<RadiusSettingOutlined />}
                  onClick={toggleRoundByDrag}
                  block
                  style={{ height: 40 }}
                >
                  🔵 Round by Drag
                </Button>
              </Tooltip>

              <Button
                icon={<BorderOutlined />}
                onClick={autoSquare}
                block
                style={{ height: 40 }}
              >
                📐 Auto-Square (90°)
              </Button>

              {roundByDragActive && (
                <Alert
                  type={roundingPoints.length === 2 ? "success" : "info"}
                  title={
                    roundingPoints.length === 0
                      ? "Step 1: Click first point"
                      : roundingPoints.length === 1
                        ? "Step 2: Click second adjacent point"
                        : "Step 3: Drag the green midpoint"
                  }
                  showIcon
                />
              )}
            </Space>
          </Card>

          {/* Precision Movement */}
          {selectedPoint && toolMode === "select-point" && (
            <Card
              title="🎯 Precision Movement"
              size="small"
              className="shadow-md border-2 border-purple-400"
            >
              <Space orientation="vertical" className="w-full" size="small">
                <Alert
                  title={`Point ${selectedPoint.pointIndex + 1}`}
                  description={`Position: (${Math.round(
                    shapes[selectedPoint.shapeIndex]?.points[
                      selectedPoint.pointIndex
                    ][0],
                  )}, ${Math.round(
                    shapes[selectedPoint.shapeIndex]?.points[
                      selectedPoint.pointIndex
                    ][1],
                  )})`}
                  type="info"
                  showIcon
                />

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Move Increment: {moveIncrement}"
                  </label>
                  <InputNumber
                    value={moveIncrement}
                    onChange={(value) => setMoveIncrement(value || 0.5)}
                    min={0.1}
                    max={12}
                    step={0.1}
                    style={{ width: "100%" }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <Button
                    type="primary"
                    icon={<ArrowUpOutlined />}
                    onClick={() =>
                      movePoint(
                        selectedPoint.shapeIndex,
                        selectedPoint.pointIndex,
                        "up",
                      )
                    }
                    block
                    size="small"
                  />
                  <div></div>

                  <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() =>
                      movePoint(
                        selectedPoint.shapeIndex,
                        selectedPoint.pointIndex,
                        "left",
                      )
                    }
                    block
                    size="small"
                  />
                  <div className="flex items-center justify-center text-xs font-medium bg-gray-100 rounded">
                    {moveIncrement}"
                  </div>
                  <Button
                    type="primary"
                    icon={<ArrowRightOutlined />}
                    onClick={() =>
                      movePoint(
                        selectedPoint.shapeIndex,
                        selectedPoint.pointIndex,
                        "right",
                      )
                    }
                    block
                    size="small"
                  />

                  <div></div>
                  <Button
                    type="primary"
                    icon={<ArrowDownOutlined />}
                    onClick={() =>
                      movePoint(
                        selectedPoint.shapeIndex,
                        selectedPoint.pointIndex,
                        "down",
                      )
                    }
                    block
                    size="small"
                  />
                  <div></div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  <Button
                    onClick={() => setSelectedPoint(null)}
                    block
                    size="small"
                  >
                    Deselect
                  </Button>
                  <Button
                    danger
                    onClick={() => {
                      deletePoint(
                        selectedPoint.shapeIndex,
                        selectedPoint.pointIndex,
                      );
                      setSelectedPoint(null);
                    }}
                    block
                    size="small"
                  >
                    Delete
                  </Button>
                </div>
              </Space>
            </Card>
          )}

          <DimensionInput
            shapes={shapes}
            updateShapes={updateShapes}
            unit={unit}
            setUnit={setUnit}
          />
        </>
      )}

      {/* Step 2: Drilling Holes */}
      {currentStep === 2 && (
        <DrillingHoles
          drillingHoles={drillingHoles}
          setDrillingHoles={setDrillingHoles}
          isPlacingHole={isPlacingHole}
          setIsPlacingHole={setIsPlacingHole}
          setToolMode={setToolMode}
          shapes={shapes}
        />
      )}

      {/* Step 3: Material Selection */}
      {currentStep === 3 && (
        <MaterialSelector
          selectedMaterial={selectedMaterial}
          setSelectedMaterial={setSelectedMaterial}
          selectedThickness={selectedThickness}
          setSelectedThickness={setSelectedThickness}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
          specialColorRequest={specialColorRequest}
          setSpecialColorRequest={setSpecialColorRequest}
        />
      )}

      {/* Step 4: Review & Pricing */}
      {currentStep === 4 && (
        <>
          <ValidationPanel
            validationErrors={validationErrors}
            validateOrder={validateOrder}
          />
          <PricingPanel
            totalArea={totalArea}
            totalPerimeter={totalPerimeter}
            selectedMaterial={selectedMaterial}
            selectedThickness={selectedThickness}
            selectedColor={selectedColor}
            specialColorRequest={specialColorRequest}
            shapes={shapes}
          />
        </>
      )}

      {/* Shape Properties */}
      {selectedShape && currentStep === 1 && (
        <ShapeProperties
          shapes={shapes}
          selectedShape={selectedShape}
          updateShapes={updateShapes}
          setSelectedShape={setSelectedShape}
          setSelectedPoint={setSelectedPoint}
        />
      )}

      {/* Settings */}
      {currentStep === 1 && (
        <Settings
          gridSize={gridSize}
          setGridSize={setGridSize}
          gridVisible={gridVisible}
          setGridVisible={setGridVisible}
          snapToGrid={snapToGrid}
          setSnapToGrid={setSnapToGrid}
          showMeasurements={showMeasurements}
          setShowMeasurements={setShowMeasurements}
        />
      )}

      {/* Navigation Buttons */}
      <Card size="small" className="shadow-md">
        <div className="flex gap-2">
          {currentStep > 1 && (
            <Button
              onClick={() => setCurrentStep(currentStep - 1)}
              block
              size="large"
            >
              ← Previous
            </Button>
          )}
          <Button type="primary" onClick={handleNextStep} block size="large">
            {currentStep === 4 ? "Submit Order" : "Next →"}
          </Button>
        </div>
      </Card>

      {/* Delivery Info */}
      <Card size="small" className="shadow-md bg-amber-50 border-amber-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚚</span>
          <div>
            <div className="font-bold text-amber-800">Delivery Time</div>
            <div className="text-sm text-amber-700">
              3-4 weeks production time
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LeftSidebar;
