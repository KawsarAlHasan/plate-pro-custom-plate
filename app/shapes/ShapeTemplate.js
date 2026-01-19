"use client";
import { useRouter } from "next/navigation";
import { useShapeList } from "../api/shapeListApi";

const shapeTemplates = [
  {
    id: "shape-1",
    name: "Sample Rectangle",
    icon: "/shapes/dxf-editor-1767094058188.png",
    description: "Standard rectangular countertop",
    points: [
      [291, 269],
      [378, 132],
      [597, 132],
      [681, 270],
      [681, 624],
      [291, 624],
    ],
    closed: true,
  },
  {
    id: "shape-2",
    name: "Sample Rectangle",
    icon: "/shapes/dxf-editor-1767093533807.png",
    description: "Standard rectangular countertop",
    points: [
      [192, 227],
      [213, 211],
      [235, 197],
      [258, 184],
      [283, 173],
      [308, 165],
      [334, 159],
      [360, 155],
      [387, 154],
      [414, 155],
      [440, 159],
      [466, 165],
      [491, 173],
      [516, 184],
      [539, 197],
      [561, 211],
      [582, 228],
      [582, 582],
      [192, 582],
    ],
    closed: true,
  },
  {
    id: "worktop-l",
    name: "L-Shaped Worktop",
    icon: "/shapes/l.png",
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
    icon: "/shapes/u.png",
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
    icon: "/shapes/r-u.png",
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
    id: "t-shape",
    name: "T-Shape",
    icon: "/shapes/t.png",
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
    id: "hexagon",
    name: "Hexagon",
    icon: "/shapes/hexagon.png",
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
    id: "Trapezoid",
    name: "Trapezoid",
    icon: "/shapes/Trapezoid.png",
    points: [
      [250, 200],
      [450, 200],
      [500, 400],
      [200, 400],
    ],
    closed: true,
  },
  {
    id: "sink-cutout",
    name: "With Sink Cutout",
    icon: "/shapes/sink-cutout.png",
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
  {
    id: "worktop-basic",
    name: "Basic Worktop",
    icon: "/shapes/rectangle.png",
    description: "Standard rectangular countertop",
    points: [
      [150, 200],
      [550, 200],
      [550, 400],
      [150, 400],
    ],
    closed: true,
  },
];

function ShapeTemplate({ onShapeSelect }) {
  const router = useRouter();
  const { shapeList, isLoading, isError, mutate } = useShapeList();



  return (
    <div className="p-4">
      <h2 className="text-center mb-4 font-bold">Shape Templates</h2>
      <div className="text-center overflow-scroll h-[90vh] p-4">
        {shapeList?.map((template) => (
          <div
            key={template.id}
            className="cursor-pointer border p-2 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            onClick={() => router.push(`/shapes?shapeId=${template.id}`)}
          >
            <img
              src={template.icon}
              alt={template.name}
              className="w-[250px]  object-contain mb-2 mx-auto"
            />
            <span>{template.name}</span>
          </div>
        ))}
        {/* {shapeTemplates.map((template) => (
          <div
            key={template.id}
            className="cursor-pointer border p-2 mb-2 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            onClick={() => createShapeFromTemplate(template)}
          >
            <img
              src={template.icon}
              alt={template.name}
              className="w-[250px]  object-contain mb-2 mx-auto"
            />
            <span>{template.name}</span>
          </div>
        ))} */}
      </div>
    </div>
  );
}

export default ShapeTemplate;
