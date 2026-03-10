// DrillingHoles.js
"use client";
import {
  Card,
  Button,
  Space,
  InputNumber,
  Alert,
  Divider,
  Table,
  Popconfirm,
  message,
  Badge,
  Switch,
  Tooltip,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  AimOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";
import React, { useState } from "react";

function DrillingHoles({
  lang,
  holesText,
  drillingHoles,
  setDrillingHoles,
  isPlacingHole,
  setIsPlacingHole,
  setToolMode,
  shapes,
  // NEW: Distance constraint props
  minHoleDistance,
  setMinHoleDistance,
  maxHoleDistance,
  setMaxHoleDistance,
}) {
  const [editingHole, setEditingHole] = useState(null);
  const [editX, setEditX] = useState(0);
  const [editY, setEditY] = useState(0);
  const [maxEnabled, setMaxEnabled] = useState(maxHoleDistance !== null);

  const isEn = lang === "en";

  const HOLE_DIAMETER = 6; // Fixed 6mm diameter
  const MIN_HOLES = 2;

  // Start placing hole
  const startPlacingHole = () => {
    setIsPlacingHole(true);
    setToolMode("place-hole");
    message.info(holesText?.placeHoleMessage);
  };

  // Delete hole
  const deleteHole = (holeId) => {
    setDrillingHoles(drillingHoles.filter((h) => h.id !== holeId));
    message.success(holesText?.holeDeleted);
  };

  // Save hole position
  const saveHolePosition = (holeId) => {
    setDrillingHoles(
      drillingHoles.map((h) =>
        h.id === holeId ? { ...h, x: editX, y: editY } : h,
      ),
    );
    setEditingHole(null);
    message.success(holesText?.holePositionUpdated);
  };

  // Toggle max distance constraint
  const handleToggleMax = (checked) => {
    setMaxEnabled(checked);
    if (checked) {
      // Default max = minHoleDistance + 20mm when first enabled
      setMaxHoleDistance((minHoleDistance || 10) + 20);
    } else {
      setMaxHoleDistance(null);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: 40,
      render: (_, __, idx) => (
        <Badge count={idx + 1} style={{ backgroundColor: "#1890ff" }} />
      ),
    },
    {
      title: holesText?.size,
      dataIndex: "index",
      key: "6mm",
      width: 80,
      render: () => <span>6mm</span>,
    },
    {
      title: holesText?.actions,
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Space size="small">
          {editingHole === record.id ? (
            <Button
              type="primary"
              size="small"
              onClick={() => saveHolePosition(record.id)}
            >
              {holesText?.save}
            </Button>
          ) : (
            <Popconfirm
              title={holesText?.deleteTitle}
              onConfirm={() => deleteHole(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const holesNeeded = MIN_HOLES - drillingHoles.length;
  const isValid = drillingHoles.length >= MIN_HOLES;

  return (
    <Card
      title={
        <div className="flex items-center justify-between">
          <span>🕳️ {holesText?.drillingHoles}</span>
          <Badge
            count={drillingHoles.length}
            style={{ backgroundColor: isValid ? "#52c41a" : "#ff4d4f" }}
          />
        </div>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        {/* Status Alert */}
        {!isValid ? (
          <Alert
            type="warning"
            title={
              isEn
                ? `${holesNeeded} more hole${holesNeeded > 1 ? "s" : ""} required`
                : `Nog ${holesNeeded} gat${holesNeeded > 1 ? "en" : ""} nodig`
            }
            description={holesText?.warningMessage}
            showIcon
          />
        ) : (
          <Alert type="success" title={holesText?.successMessage} showIcon />
        )}

        {/* Hole Specifications */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="text-sm font-medium text-blue-700 mb-1">
            {holesText?.holeSpecs}
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <span className="text-gray-500">{holesText?.diameter}:</span>
              <span className="ml-2 font-medium">
                {HOLE_DIAMETER}mm ({holesText?.fixed})
              </span>
            </div>
            <div>
              <span className="text-gray-500">{holesText?.placed}:</span>
              <span className="ml-2 font-medium">
                {drillingHoles.length} {holesText?.title}
              </span>
            </div>
          </div>
        </div>

        {/* ============= NEW: Distance from Edge Settings ============= */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
          <div className="flex items-center gap-1 text-sm font-semibold text-amber-800 mb-2">
            <InfoCircleOutlined />
            <span>
              {isEn ? "Distance from Edge" : "Afstand van de rand"}
            </span>
          </div>

          {/* Min Distance */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-600">
                {isEn ? "Minimum distance" : "Minimale afstand"}
              </label>
              <Tooltip
                title={
                  isEn
                    ? "Hole must be at least this far from any edge"
                    : "Gat moet minimaal deze afstand van de rand zijn"
                }
              >
                <InfoCircleOutlined className="text-gray-400 text-xs" />
              </Tooltip>
            </div>
            <div className="flex items-center gap-2">
              <InputNumber
                value={minHoleDistance}
                onChange={(val) => setMinHoleDistance(val ?? 0)}
                min={0}
                max={maxHoleDistance !== null ? maxHoleDistance - 1 : 500}
                step={1}
                addonAfter="mm"
                size="small"
                style={{ width: "100%" }}
              />
            </div>
            {minHoleDistance > 0 && (
              <div className="mt-1 text-xs text-amber-700 bg-amber-100 rounded px-2 py-1">
                {isEn
                  ? `✓ Holes must be ≥ ${minHoleDistance}mm from any edge`
                  : `✓ Gaten moeten ≥ ${minHoleDistance}mm van de rand zijn`}
              </div>
            )}
          </div>

          {/* Max Distance (optional) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-gray-600">
                {isEn ? "Maximum distance" : "Maximale afstand"}
              </label>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">
                  {isEn ? "Enable" : "Inschakelen"}
                </span>
                <Switch
                  size="small"
                  checked={maxEnabled}
                  onChange={handleToggleMax}
                />
              </div>
            </div>
            {maxEnabled && (
              <>
                <div className="flex items-center gap-2">
                  <InputNumber
                    value={maxHoleDistance}
                    onChange={(val) => setMaxHoleDistance(val ?? null)}
                    min={minHoleDistance + 1}
                    max={9999}
                    step={1}
                    addonAfter="mm"
                    size="small"
                    style={{ width: "100%" }}
                  />
                </div>
                <div className="mt-1 text-xs text-amber-700 bg-amber-100 rounded px-2 py-1">
                  {isEn
                    ? `✓ Holes must be ≤ ${maxHoleDistance}mm from the nearest edge`
                    : `✓ Gaten moeten ≤ ${maxHoleDistance}mm van de dichtstbijzijnde rand zijn`}
                </div>
              </>
            )}
          </div>

          {/* Active rule summary */}
          {(minHoleDistance > 0 || maxEnabled) && (
            <div className="mt-2 pt-2 border-t border-amber-200">
              <div className="text-xs font-medium text-amber-900">
                {isEn ? "Active rule:" : "Actieve regel:"}
              </div>
              <div className="text-xs text-amber-700 mt-0.5">
                {minHoleDistance > 0 && !maxEnabled &&
                  (isEn
                    ? `Edge distance ≥ ${minHoleDistance}mm`
                    : `Randafstand ≥ ${minHoleDistance}mm`)}
                {minHoleDistance === 0 && maxEnabled &&
                  (isEn
                    ? `Edge distance ≤ ${maxHoleDistance}mm`
                    : `Randafstand ≤ ${maxHoleDistance}mm`)}
                {minHoleDistance > 0 && maxEnabled &&
                  (isEn
                    ? `${minHoleDistance}mm ≤ edge distance ≤ ${maxHoleDistance}mm`
                    : `${minHoleDistance}mm ≤ randafstand ≤ ${maxHoleDistance}mm`)}
              </div>
            </div>
          )}
        </div>
        {/* ============= END Distance Settings ============= */}

        {/* Add Hole Button */}
        <Button
          type={isPlacingHole ? "default" : "primary"}
          icon={isPlacingHole ? <AimOutlined spin /> : <PlusOutlined />}
          onClick={startPlacingHole}
          block
          size="large"
          disabled={isPlacingHole}
          className={isPlacingHole ? "animate-pulse" : ""}
        >
          {isPlacingHole
            ? holesText?.addingLoading
            : holesText?.addDrillingHole}
        </Button>

        {isPlacingHole && (
          <Alert
            type="info"
            title={holesText?.pricingAlertTitle}
            description={
              isEn
                ? `Click inside the shape. Hole must be${minHoleDistance > 0 ? ` ≥${minHoleDistance}mm` : ""}${maxEnabled ? ` and ≤${maxHoleDistance}mm` : ""} from any edge.`
                : `Klik binnen de vorm. Gat moet${minHoleDistance > 0 ? ` ≥${minHoleDistance}mm` : ""}${maxEnabled ? ` en ≤${maxHoleDistance}mm` : ""} van de rand zijn.`
            }
            showIcon
          />
        )}

        <Divider style={{ margin: "8px 0" }}>{holesText?.placedHoles}</Divider>

        {/* Holes Table */}
        {drillingHoles.length > 0 ? (
          <Table
            dataSource={drillingHoles.map((h) => ({ ...h, key: h.id }))}
            columns={columns}
            size="small"
            pagination={false}
            scroll={{ y: 200 }}
          />
        ) : (
          <div className="text-center text-gray-400 py-4">
            <AimOutlined style={{ fontSize: 32 }} />
            <div className="mt-2">{holesText?.noHoles}</div>
          </div>
        )}
      </Space>
    </Card>
  );
}

export default DrillingHoles;