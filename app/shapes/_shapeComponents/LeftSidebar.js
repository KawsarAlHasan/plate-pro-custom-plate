// LeftSidebar.js
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
  Tour,
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
  CloseOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import StepIndicator from "./_leftSidebar/StepIndicator";
import Settings from "./_leftSidebar/Settings";
import ShapeProperties from "./_leftSidebar/ShapeProperties";
import DrillingHoles from "./_leftSidebar/DrillingHoles";
import MaterialSelector from "./_leftSidebar/MaterialSelector";
import PricingPanel from "./_leftSidebar/PricingPanel";
import DimensionInput from "./_leftSidebar/DimensionInput";
import ValidationPanel from "./_leftSidebar/ValidationPanel";
import { showToast } from "nextjs-toast-notify";
import { useEffect, useRef, useState } from "react";
import {
  getMoveIncrementTourSteps,
  getShapeTourSteps,
} from "../../lib/steps/TourSteps";
import CookiesCheck from "../../_component/CookiesCheck";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

function LeftSidebar({
  lang,
  shapesText,
  showShapeTemplate,
  setShowShapeTemplate,
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

  /* NEW: Hole distance constraints */
  minHoleDistance,
  maxHoleDistance,

  /* Material selection */
  selectedMaterial,
  setSelectedMaterial,
  selectedThickness,
  setSelectedThickness,
  selectedColor,
  setSelectedColor,
  selectedFinish,
  setSelectedFinish,

  /* Validation & pricing */
  validationErrors,
  validateOrder,
  totalArea,
  totalPerimeter,

  /* Material list */
  materialList,
  isMaterialLoading,
  handleSubmitOrder,
}) {
  const isEn = lang === "en";

  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [moveIncrementopen, setMoveIncrementOpen] = useState(false);

  const isShape = CookiesCheck("shape") ? false : true;
  const isPoint = CookiesCheck("point") ? false : true;

  useEffect(() => {
    if (isShape) {
      setOpen(true);
    }

    if (selectedPoint && isPoint) {
      setMoveIncrementOpen(true);
    }
  }, [isShape, isPoint, selectedPoint]);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);
  const ref10 = useRef(null);
  const ref11 = useRef(null);
  const ref12 = useRef(null);

  const steps = getShapeTourSteps(isEn, {
    ref1,
    ref2,
    ref3,
    ref4,
    ref5,
    ref6,
    ref7,
    ref11,
    ref12,
  });

  const moveIncrementsteps = getMoveIncrementTourSteps(isEn, {
    ref8,
    ref9,
    ref10,
  });

  const toggleShapeLock = (check) => {
    const updatedShapes = shapes.map((shape) =>
      shape.id ? { ...shape, locked: check } : shape,
    );
    updateShapes(updatedShapes);
    showToast.success(
      check ? shapesText?.shapeLocked : shapesText?.shapeUnlocked,
      {
        duration: 2000,
      },
    );
  };

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === 1) {
      toggleShapeLock(true);
    } else if (currentStep === 2) {
      setGridVisible(false);
    }

    if (currentStep === 1 && shapes.length === 0) {
      message.warning(shapesText?.drawShapeFirst);
      return;
    }
    if (currentStep === 2 && drillingHoles.length < 2) {
      message.warning(shapesText?.addTwoHoles);
      return;
    }
    if (currentStep === 3 && (!selectedMaterial || !selectedThickness)) {
      message.warning(shapesText?.selectMaterial);
      return;
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      // Final validation
      if (validateOrder()) {
        // setShowValidationModal(true);
        handleSubmitOrder();
      } else {
        message.error(shapesText?.fixErrors);
      }
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }

    // when user goes back to step 1, unlock the shape
    if (currentStep === 2) {
      setDrillingHoles([]); // reset holes
      toggleShapeLock(false); // unlock shape
    } else if (currentStep === 3) {
      setGridVisible(true);
    }
  };

  const handleTourClose = () => {
    setOpen(false);
    Cookies.set("shape", true, { expires: 365 });
  };

  const handleMoveIncrementClose = () => {
    setMoveIncrementOpen(false);
    Cookies.set("point", true, { expires: 365 });
  };

  const handleRemoveCookies = () => {
    if (currentStep === 1) {
      Cookies.remove("shape");
      Cookies.remove("point");
    } else if (currentStep === 2) {
      Cookies.remove("holes");
    } else if (currentStep === 3) {
      Cookies.remove("material");
      Cookies.remove("thickness");
    }
    // reload the page
    router.refresh();
  };

  return (
    <div
      className={
        showShapeTemplate
          ? "col-span-4 space-y-4 overflow-y-auto"
          : "col-span-3 space-y-4 overflow-y-auto"
      }
    >
      <Tour open={open} onClose={() => handleTourClose()} steps={steps} />
      <Tour
        open={moveIncrementopen}
        onClose={() => handleMoveIncrementClose()}
        steps={moveIncrementsteps}
      />

      {/* Toggle Button */}
      <div className="mb-1 flex justify-between">
        <Button
          ref={ref1}
          type={showShapeTemplate ? "primary" : "default"}
          icon={showShapeTemplate ? <CloseOutlined /> : <AppstoreOutlined />}
          onClick={() => setShowShapeTemplate(!showShapeTemplate)}
          className="shadow-sm"
        >
          {showShapeTemplate
            ? shapesText?.hideTemplates
            : shapesText?.showTemplates}
        </Button>

        <Button type="default" onClick={() => handleRemoveCookies()}>
          Show Instructions
        </Button>
      </div>

      {/* Step Indicator */}
      <StepIndicator
        shapesText={shapesText}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
        shapes={shapes}
        updateShapes={updateShapes}
        setGridVisible={setGridVisible}
      />

      <div className="max-h-screen">
        {/* Step 1: Shape Drawing */}
        {currentStep === 1 && (
          <>
            {/* Editing Tools */}
            <Card
              title={shapesText?.drawingTools}
              size="small"
              className="shadow-md"
            >
              <Space orientation="vertical" className="w-full" size="small">
                <div className="grid grid-cols-4 gap-2">
                  <Tooltip title={shapesText?.moveTooltip}>
                    <Button
                      type={toolMode === "select" ? "primary" : "default"}
                      icon={<DragOutlined />}
                      onClick={() => setToolMode("select")}
                      style={{ height: 40 }}
                      ref={ref2}
                    >
                      {shapesText?.move}
                    </Button>
                  </Tooltip>
                  <Tooltip title={shapesText?.pointTooltip}>
                    <Button
                      type={toolMode === "select-point" ? "primary" : "default"}
                      icon={<AimOutlined />}
                      onClick={() => setToolMode("select-point")}
                      style={{ height: 40 }}
                      ref={ref3}
                    >
                      {shapesText?.point}
                    </Button>
                  </Tooltip>
                  <Tooltip title={shapesText?.addTooltip}>
                    <Button
                      type={toolMode === "add-point" ? "primary" : "default"}
                      icon={<PlusOutlined />}
                      onClick={() => setToolMode("add-point")}
                      style={{ height: 40 }}
                      ref={ref4}
                    >
                      {shapesText?.add}
                    </Button>
                  </Tooltip>
                  <Tooltip title={shapesText?.deleteTooltip}>
                    <Button
                      type={toolMode === "delete-point" ? "primary" : "default"}
                      icon={<DeleteOutlined />}
                      onClick={() => setToolMode("delete-point")}
                      style={{ height: 40 }}
                      ref={ref5}
                    >
                      {shapesText?.delete}
                    </Button>
                  </Tooltip>
                </div>

                {toolMode === "select" && (
                  <Alert
                    type="info"
                    title={shapesText?.moveShapeInfo}
                    showIcon
                  />
                )}

                <Divider style={{ margin: "8px 0" }}>
                  {shapesText?.rounding}
                </Divider>
                <Tooltip title={shapesText?.roundByDragTooltip}>
                  <Button
                    type={roundByDragActive ? "primary" : "default"}
                    icon={<RadiusSettingOutlined />}
                    onClick={toggleRoundByDrag}
                    block
                    style={{ height: 40 }}
                    ref={ref6}
                  >
                    {shapesText?.roundByDrag}
                  </Button>
                </Tooltip>

                <Button
                  icon={<BorderOutlined />}
                  onClick={autoSquare}
                  block
                  style={{ height: 40 }}
                  ref={ref7}
                >
                  {shapesText?.autoSquare}
                </Button>

                {roundByDragActive && (
                  <Alert
                    type={roundingPoints.length === 2 ? "success" : "info"}
                    title={
                      roundingPoints.length === 0
                        ? shapesText?.roundStep1
                        : roundingPoints.length === 1
                          ? shapesText?.roundStep2
                          : shapesText?.roundStep3
                    }
                    showIcon
                  />
                )}
              </Space>
            </Card>

            {/* Precision Movement */}
            {selectedPoint && toolMode === "select-point" && (
              <Card
                title={shapesText?.precisionMovement}
                size="small"
                className="shadow-md border-2 border-purple-400"
              >
                <Space orientation="vertical" className="w-full" size="small">
                  <Alert
                    title={`${shapesText?.pointLabel} ${selectedPoint.pointIndex + 1}`}
                    description={`${shapesText?.position}: (${Math.round(
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

                  <div ref={ref8}>
                    <label className="block text-sm font-medium mb-2">
                      {shapesText?.moveIncrement}: {moveIncrement}"
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

                  <div className="grid grid-cols-3 gap-2" ref={ref9}>
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

                  <div className="grid grid-cols-2 gap-2 mt-2" ref={ref10}>
                    <Button
                      onClick={() => setSelectedPoint(null)}
                      block
                      size="small"
                    >
                      {shapesText?.deselect}
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
                      {shapesText?.deletePoint}
                    </Button>
                  </div>
                </Space>
              </Card>
            )}

            <div ref={ref11}>
              <DimensionInput
                lang={lang}
                shapeText={shapesText?.shape}
                shapes={shapes}
                updateShapes={updateShapes}
                unit={unit}
                setUnit={setUnit}
              />
            </div>
          </>
        )}

        {/* Step 2: Drilling Holes */}
        {currentStep === 2 && (
          <DrillingHoles
            lang={lang}
            holesText={shapesText?.holes}
            drillingHoles={drillingHoles}
            setDrillingHoles={setDrillingHoles}
            isPlacingHole={isPlacingHole}
            setIsPlacingHole={setIsPlacingHole}
            setToolMode={setToolMode}
            shapes={shapes}
            // NEW: Pass distance constraints through
            minHoleDistance={minHoleDistance}
            maxHoleDistance={maxHoleDistance}
          />
        )}

        {/* Step 3: Material Selection */}
        {currentStep === 3 && (
          <MaterialSelector
            lang={lang}
            materialText={shapesText?.material}
            selectedMaterial={selectedMaterial}
            setSelectedMaterial={setSelectedMaterial}
            selectedThickness={selectedThickness}
            setSelectedThickness={setSelectedThickness}
            selectedColor={selectedColor}
            setSelectedColor={setSelectedColor}
            selectedFinish={selectedFinish}
            setSelectedFinish={setSelectedFinish}
            materialList={materialList}
            isMaterialLoading={isMaterialLoading}
          />
        )}

        {/* Step 4: Review & Pricing */}
        {currentStep === 4 && (
          <>
            {/* <ValidationPanel
              lang={lang}
              validationErrors={validationErrors}
              validateOrder={validateOrder}
            /> */}
            <PricingPanel
              lang={lang}
              totalArea={totalArea}
              drillingHoles={drillingHoles}
              totalPerimeter={totalPerimeter}
              selectedMaterial={selectedMaterial}
              selectedThickness={selectedThickness}
              selectedColor={selectedColor}
              selectedFinish={selectedFinish}
              shapes={shapes}
              materialList={materialList}
            />
          </>
        )}

        {/* Shape Properties */}
        {/* {selectedShape && currentStep === 1 && (
          <ShapeProperties
            shapes={shapes}
            selectedShape={selectedShape}
            updateShapes={updateShapes}
            setSelectedShape={setSelectedShape}
            setSelectedPoint={setSelectedPoint}
          />
        )} */}

        {/* Settings */}
        {/* {currentStep === 1 && (
          <Settings
            lang={lang}
            gridSize={gridSize}
            setGridSize={setGridSize}
            gridVisible={gridVisible}
            setGridVisible={setGridVisible}
            snapToGrid={snapToGrid}
            setSnapToGrid={setSnapToGrid}
            showMeasurements={showMeasurements}
            setShowMeasurements={setShowMeasurements}
          />
        )} */}

        {/* Navigation Buttons */}
        <Card size="small" className="shadow-md" ref={ref12}>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button onClick={handlePrevStep} block size="large">
                {shapesText?.previous}
              </Button>
            )}
            <Button type="primary" onClick={handleNextStep} block size="large">
              {currentStep === 4 ? shapesText?.submitOrder : shapesText?.next}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default LeftSidebar;
