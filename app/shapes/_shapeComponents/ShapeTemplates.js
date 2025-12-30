"use client";
import { Card, Button, Space, Divider, Tooltip } from "antd";
import { AppstoreOutlined } from "@ant-design/icons";
import React from "react";

const shapeTemplates = [
  {
    id: "rectangle",
    name: "Rectangle",
    icon: "⬜",
    points: [
      [200, 200],
      [500, 200],
      [500, 450],
      [200, 450],
    ],
    closed: true,
  },
  {
    id: "l-shape",
    name: "L-Shape",
    icon: "🔲",
    points: [
      [200, 150],
      [400, 150],
      [400, 300],
      [300, 300],
      [300, 450],
      [200, 450],
    ],
    closed: true,
  },
  {
    id: "t-shape",
    name: "T-Shape",
    icon: "⊤",
    points: [
      [200, 150],
      [500, 150],
      [500, 250],
      [400, 250],
      [400, 450],
      [300, 450],
      [300, 250],
      [200, 250],
    ],
    closed: true,
  },
  {
    id: "u-shape",
    name: "U-Shape",
    icon: "⊔",
    points: [
      [200, 150],
      [280, 150],
      [280, 350],
      [420, 350],
      [420, 150],
      [500, 150],
      [500, 450],
      [200, 450],
    ],
    closed: true,
  },
  {
    id: "hexagon",
    name: "Hexagon",
    icon: "⬡",
    points: (() => {
      const cx = 350,
        cy = 300,
        r = 120;
      return [0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (Math.PI / 3) * i - Math.PI / 2;
        return [cx + r * Math.cos(angle), cy + r * Math.sin(angle)];
      });
    })(),
    closed: true,
  },
  {
    id: "arrow",
    name: "Arrow",
    icon: "➤",
    points: [
      [200, 280],
      [350, 280],
      [350, 200],
      [500, 300],
      [350, 400],
      [350, 320],
      [200, 320],
    ],
    closed: true,
  },
  {
    id: "trapezoid",
    name: "Trapezoid",
    icon: "⏢",
    points: [
      [250, 200],
      [450, 200],
      [500, 400],
      [200, 400],
    ],
    closed: true,
  },
  {
    id: "star",
    name: "Star (5pt)",
    icon: "⭐",
    points: (() => {
      const cx = 350,
        cy = 300;
      const outerR = 120,
        innerR = 50;
      const points = [];
      for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (Math.PI / 5) * i - Math.PI / 2;
        points.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      return points;
    })(),
    closed: true,
  },
];

const mostOrderedShapes = [
  {
    id: "worktop-basic",
    name: "Basic Worktop",
    icon: "🔲",
    description: "Standard rectangular countertop",
    points: [
      [150, 200],
      [550, 200],
      [550, 400],
      [150, 400],
    ],
    closed: true,
  },
  {
    id: "worktop-l",
    name: "L-Shaped Worktop",
    icon: "📐",
    description: "Corner kitchen countertop",
    points: [
      [267, 147],
      [422, 146],
      [420, 306],
      [552, 305],
      [552, 401],
      [267, 401],
    ],
    closed: true,
  },
  {
    id: "worktop-u",
    name: "U-Shaped Worktop",
    icon: "⊔",
    description: "Three-sided kitchen counter",
    points: [
      [150, 150],
      [250, 150],
      [250, 350],
      [450, 350],
      [450, 150],
      [550, 150],
      [550, 450],
      [150, 450],
    ],
    closed: true,
  },

  {
    id: "worktop-realistic-u",
    name: "Realistic U-Shaped Worktop",
    icon: "U",
    description: "Three-sided kitchen counter",
    points: [
      [287, 103],
      [387, 103],
      [387, 303],
      [389, 322],
      [395, 341],
      [404, 358],
      [416, 373],
      [431, 385],
      [449, 394],
      [467, 400],
      [487, 402],
      [506, 400],
      [525, 394],
      [542, 385],
      [557, 373],
      [570, 358],
      [579, 341],
      [585, 322],
      [587, 303],
      [587, 103],
      [687, 103],
      [687, 302],
      [683, 341],
      [672, 378],
      [653, 412],
      [628, 442],
      [598, 467],
      [564, 485],
      [526, 497],
      [487, 500],
      [449, 497],
      [411, 485],
      [377, 467],
      [347, 442],
      [322, 412],
      [303, 378],
      [292, 341],
      [288, 302],
    ],
    closed: true,
  },
  {
    id: "island",
    name: "Kitchen Island",
    icon: "🏝️",
    description: "Standalone island counter",
    points: [
      [200, 220],
      [500, 220],
      [500, 380],
      [200, 380],
    ],
    closed: true,
  },
  {
    id: "sink-cutout",
    name: "With Sink Cutout",
    icon: "🚰",
    description: "Worktop with sink area",
    points: [
      [150, 200],
      [550, 200],
      [550, 400],
      [450, 400],
      [450, 320],
      [350, 320],
      [350, 400],
      [150, 400],
    ],
    closed: true,
  },
];

function ShapeTemplates({ onShapeSelect }) {
  const createShapeFromTemplate = (template) => {
    const newShape = {
      id: `shape-${Date.now()}`,
      type: template.id,
      points: [...template.points.map((p) => [...p])],
      color: "#1890ff",
      strokeWidth: 2,
      closed: template.closed,
      visible: true,
      locked: false,
      name: template.name,
    };

    onShapeSelect([newShape]);
  };

  return (
    <Card
      title={
        <span>
          <AppstoreOutlined className="mr-2" />
          Shape Templates
        </span>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        <div className="text-xs text-gray-500 mb-1">Basic Shapes</div>
        <div className="grid grid-cols-4 gap-2">
          {shapeTemplates.map((template) => (
            <Tooltip key={template.id} title={template.name}>
              <Button
                onClick={() => createShapeFromTemplate(template)}
                className="h-12 text-lg"
              >
                {template.icon}
              </Button>
            </Tooltip>
          ))}
        </div>

        <Divider style={{ margin: "12px 0" }}>
          <span className="text-xs text-gray-500">🔥 Most Ordered</span>
        </Divider>

        <div className="space-y-2">
          {mostOrderedShapes.map((template) => (
            <Button
              key={template.id}
              onClick={() => createShapeFromTemplate(template)}
              block
              className="h-auto py-2 text-left"
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{template.icon}</span>
                <div>
                  <div className="font-medium">{template.name}</div>
                  <div className="text-xs text-gray-500">
                    {template.description}
                  </div>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </Space>
    </Card>
  );
}

export default ShapeTemplates;
