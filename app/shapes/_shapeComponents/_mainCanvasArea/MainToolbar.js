"use client";
import {
  RedoOutlined,
  UndoOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
} from "@ant-design/icons";
import { Button, Divider, Statistic, Tooltip } from "antd";
import { showToast } from "nextjs-toast-notify";

function MainToolbar({
  lang,
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
}) {
  const isEn = lang === "en";

  const t = {
    undo: isEn ? "Undo" : "Ongedaan maken",
    redo: isEn ? "Redo" : "Opnieuw uitvoeren",
    undoSuccess: isEn ? "Undo successful" : "Ongedaan maken geslaagd",
    nothingToUndo: isEn ? "Nothing to undo" : "Niets om ongedaan te maken",
    redoSuccess: isEn ? "Redo successful" : "Opnieuw uitvoeren geslaagd",
    nothingToRedo: isEn ? "Nothing to redo" : "Niets om opnieuw uit te voeren",
    zoomIn: isEn ? "Zoom In" : "Inzoomen",
    zoomOut: isEn ? "Zoom Out" : "Uitzoomen",
    resetZoom: isEn ? "Reset Zoom" : "Zoom resetten",
    shapes: isEn ? "shapes" : "vormen",
    totalArea: isEn ? "Total Area" : "Totaal oppervlak",
  };

  // Undo/Redo System
  const handleUndo = () => {
    if (historyIndex > 0) {
      const prevState = history[historyIndex - 1];
      setShapes(prevState);
      setHistoryIndex(historyIndex - 1);
      calculateMeasurements(prevState);
      showToast.success(t.undoSuccess, { duration: 2000 });
    } else {
      showToast.warning(t.nothingToUndo, { duration: 2000 });
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const nextState = history[historyIndex + 1];
      setShapes(nextState);
      setHistoryIndex(historyIndex + 1);
      calculateMeasurements(nextState);
      showToast.success(t.redoSuccess, { duration: 2000 });
    } else {
      showToast.warning(t.nothingToRedo, { duration: 2000 });
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between mb-4 gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
      <div className="flex items-center gap-2 flex-wrap">
        <Tooltip title={t?.undo}>
          <Button
            icon={<UndoOutlined />}
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            size="large"
          />
        </Tooltip>
        <Tooltip title={t?.redo}>
          <Button
            icon={<RedoOutlined />}
            onClick={handleRedo}
            disabled={historyIndex >= history?.length - 1}
            size="large"
          />
        </Tooltip>

        <Divider orientation="vertical" />

        <Tooltip title={t?.zoomIn}>
          <Button
            icon={<ZoomInOutlined />}
            onClick={() => setScale(Math.min(5, scale * 1.2))}
            size="large"
          />
        </Tooltip>
        <Tooltip title={t?.zoomOut}>
          <Button
            icon={<ZoomOutOutlined />}
            onClick={() => setScale(Math.max(0.05, scale / 1.2))}
            size="large"
          />
        </Tooltip>
        <Button onClick={() => setScale(1)} size="large" disabled={scale === 1}>
          {t?.resetZoom}
        </Button>
        <span className="text-sm font-medium px-2 py-1 bg-white rounded">
          {Math.round(scale * 100)}%
        </span>

        <Divider orientation="vertical" />

        <span className="text-sm font-medium px-3 py-1 bg-blue-100 rounded">
          {shapes?.filter((s) => s.visible).length} / {shapes?.length}{" "}
          {t?.shapes}
        </span>
      </div>

      <div className="flex items-center gap-4">
        <Statistic
          title={t?.totalArea}
          value={totalArea?.toFixed(2)}
          suffix="sq m"
          style={{ fontSize: "16px", color: "#1890ff" }}
        />
        {/* <Statistic
          title="Perimeter"
          value={totalPerimeter?.toFixed(2)}
          suffix="ft"
          style={{ fontSize: "16px", color: "#52c41a" }}
        /> */}
      </div>
    </div>
  );
}

export default MainToolbar;
