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
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  AimOutlined,
  EditOutlined,
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
}) {
  const [editingHole, setEditingHole] = useState(null);
  const [editX, setEditX] = useState(0);
  const [editY, setEditY] = useState(0);

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

  // Start editing hole position
  const startEditingHole = (hole) => {
    setEditingHole(hole.id);
    setEditX(Math.round(hole.x));
    setEditY(Math.round(hole.y));
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

  // Calculate distance from edge
  const getDistanceFromEdge = (hole) => {
    if (shapes.length === 0 || !shapes[0].points)
      return { top: 0, left: 0, right: 0, bottom: 0 };

    const points = shapes[0].points;
    const xs = points.map((p) => p[0]);
    const ys = points.map((p) => p[1]);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);

    return {
      left: Math.round(hole.x - minX),
      right: Math.round(maxX - hole.x),
      top: Math.round(hole.y - minY),
      bottom: Math.round(maxY - hole.y),
    };
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
    // {
    //   title: "X",
    //   dataIndex: "x",
    //   key: "x",
    //   width: 80,
    //   render: (x, record) =>
    //     editingHole === record.id ? (
    //       <InputNumber
    //         value={editX}
    //         onChange={(val) => setEditX(val || 0)}
    //         size="small"
    //         style={{ width: 70 }}
    //       />
    //     ) : (
    //       <span>{Math.round(x)}px</span>
    //     ),
    // },
    // {
    //   title: "Y",
    //   dataIndex: "y",
    //   key: "y",
    //   width: 80,
    //   render: (y, record) =>
    //     editingHole === record.id ? (
    //       <InputNumber
    //         value={editY}
    //         onChange={(val) => setEditY(val || 0)}
    //         size="small"
    //         style={{ width: 70 }}
    //       />
    //     ) : (
    //       <span>{Math.round(y)}px</span>
    //     ),
    // },
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
            <>
              {/* <Button
                size="small"
                icon={<EditOutlined />}
                onClick={() => startEditingHole(record)}
              /> */}
              <Popconfirm
                title={holesText?.deleteTitle}
                onConfirm={() => deleteHole(record.id)}
                okText="Yes"
                cancelText="No"
              >
                <Button size="small" danger icon={<DeleteOutlined />} />
              </Popconfirm>
            </>
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
              lang === "en"
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
            description={holesText?.pricingAlertDesc}
            showIcon
          />
        )}

        <Divider style={{ margin: "8px 0" }}>{holesText?.placedHoles}</Divider>

        {/* Holes Table */}
        {drillingHoles.length > 0 ? (
          <Table
            dataSource={drillingHoles.map((h, idx) => ({ ...h, key: h.id }))}
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
