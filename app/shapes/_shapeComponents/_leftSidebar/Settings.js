import { Card, Space, Switch, Divider, Slider } from "antd";
import { SettingOutlined } from "@ant-design/icons";

function Settings({
  gridSize,
  setGridSize,
  gridVisible,
  setGridVisible,
  snapToGrid,
  setSnapToGrid,
  showMeasurements,
  setShowMeasurements,
}) {
  return (
    <Card
      title={
        <span>
          <SettingOutlined className="mr-2" />
          Canvas Settings
        </span>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        {/* Grid Size */}
        <div>
          <div className="flex justify-between items-center mb-1">
            <label className="text-sm font-medium">Grid Size</label>
            <span className="text-sm text-blue-600 font-mono">{gridSize}"</span>
          </div>
          <Slider
            value={gridSize}
            onChange={(value) => setGridSize(value)}
            min={0.1}
            max={5}
            step={0.1}
            marks={{
              0.1: '0.1"',
              0.5: '0.5"',
              1: '1"',
              2: '2"',
              3: '3"',
              4: '4"',
              5: '5"',
            }}
          />
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Toggle Options */}
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors">
            <div>
              <div className="text-sm font-medium">Show Grid</div>
              <div className="text-xs text-gray-500">
                Display grid lines on canvas
              </div>
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
              <div className="text-sm font-medium">Snap to Grid</div>
              <div className="text-xs text-gray-500">
                Points align to grid automatically
              </div>
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
              <div className="text-sm font-medium">Show Measurements</div>
              <div className="text-xs text-gray-500">
                Display side lengths on shape
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
