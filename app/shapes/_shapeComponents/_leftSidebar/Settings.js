import { Card, Space, Switch, Divider, Slider } from "antd";
import { SettingOutlined } from "@ant-design/icons";

function Settings({
  lang,
  gridSize,
  setGridSize,
  gridVisible,
  setGridVisible,
  snapToGrid,
  setSnapToGrid,
  showMeasurements,
  setShowMeasurements,
}) {
  const isEn = lang === "en";

  const t = {
    canvasSettings: isEn ? "Canvas Settings" : "Canvasinstellingen",
    gridSize: isEn ? "Grid Size" : "Rastergrootte",
    showGrid: isEn ? "Show Grid" : "Raster weergeven",
    showGridDesc: isEn
      ? "Display grid lines on canvas"
      : "Rasterlijnen op canvas weergeven",
    snapToGrid: isEn ? "Snap to Grid" : "Uitlijnen op raster",
    snapToGridDesc: isEn
      ? "Points align to grid automatically"
      : "Punten worden automatisch uitgelijnd op het raster",
    showMeasurements: isEn ? "Show Measurements" : "Afmetingen weergeven",
    showMeasurementsDesc: isEn
      ? "Display side lengths on shape"
      : "Zijlengtes op de vorm weergeven",
  };

  return (
    <Card
      title={
        <span>
          <SettingOutlined className="mr-2" />
          {t.canvasSettings}
        </span>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        {/* Grid Size in mm */}
        <div className="px-4">
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">{t.gridSize}</label>
            <span className="text-sm text-blue-600 font-mono">
              {gridSize}mm
            </span>
          </div>
          <Slider
            value={gridSize}
            onChange={(value) => setGridSize(value)}
            min={1}
            max={100}
            step={1}
            marks={{
              1: "1mm",
              15: "15mm",
              30: "30mm",
              50: "50mm",
              100: "100mm",
            }}
          />
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Toggle Options */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-sm font-medium">{t.showGrid}</div>
              <div className="text-xs text-gray-500">{t.showGridDesc}</div>
            </div>
            <Switch
              checked={gridVisible}
              onChange={setGridVisible}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </div>

          <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-sm font-medium">{t.snapToGrid}</div>
              <div className="text-xs text-gray-500">{t.snapToGridDesc}</div>
            </div>
            <Switch
              checked={snapToGrid}
              onChange={setSnapToGrid}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </div>

          <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-sm font-medium">{t.showMeasurements}</div>
              <div className="text-xs text-gray-500">
                {t.showMeasurementsDesc}
              </div>
            </div>
            <Switch
              checked={showMeasurements}
              onChange={setShowMeasurements}
              checkedChildren="ON"
              unCheckedChildren="OFF"
            />
          </div>
        </div>
      </Space>
    </Card>
  );
}

export default Settings;
