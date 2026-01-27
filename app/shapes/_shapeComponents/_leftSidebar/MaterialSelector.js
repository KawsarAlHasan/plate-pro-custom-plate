"use client";
import { Card, Button, Space, Select, Divider, Radio, Spin } from "antd";
import { CheckCircleOutlined, LoadingOutlined } from "@ant-design/icons";

const { Option } = Select;

// Standard Colors
const standardColors = [
  { id: "white", name: "Arctic White", hex: "#FFFFFF" },
  { id: "cream", name: "Cream Beige", hex: "#F5F5DC" },
  { id: "gray", name: "Stone Gray", hex: "#808080" },
  { id: "charcoal", name: "Charcoal", hex: "#36454F" },
  { id: "black", name: "Absolute Black", hex: "#1a1a1a" },
  { id: "brown", name: "Warm Brown", hex: "#8B4513" },
  { id: "navy", name: "Navy Blue", hex: "#000080" },
  { id: "green", name: "Forest Green", hex: "#228B22" },
  { id: "terracotta", name: "Terracotta", hex: "#E2725B" },
  { id: "sand", name: "Desert Sand", hex: "#EDC9AF" },
];

// Coating/Finish Options
const finishOptions = [
  { id: "polished", name: "Polished", description: "High gloss, reflective" },
  { id: "matte", name: "Matte", description: "Non-reflective, modern" },
  { id: "honed", name: "Honed", description: "Smooth, satin finish" },
  { id: "leathered", name: "Leathered", description: "Textured, tactile" },
  { id: "brushed", name: "Brushed", description: "Linear texture" },
];

function MaterialSelector({
  selectedMaterial,
  setSelectedMaterial,
  selectedThickness,
  setSelectedThickness,
  selectedColor,
  setSelectedColor,
  selectedFinish,
  setSelectedFinish,
  materialList,
  isMaterialLoading,
}) {
  // Get variants for selected material
  const selectedMaterialData = materialList?.find(
    (m) => m.id === selectedMaterial,
  );
  const availableVariants = selectedMaterialData?.variants || [];

  if (isMaterialLoading) {
    return (
      <Card title="🎨 Material & Color" size="small" className="shadow-md">
        <div className="flex justify-center items-center py-8">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        </div>
      </Card>
    );
  }

  return (
    <Card title="🎨 Material & Color" size="small" className="shadow-md">
      <Space orientation="vertical" className="w-full" size="middle">
        {/* Material Selection */}
        <div>
          <div className="text-sm font-medium mb-2">Select Material</div>
          <div className="grid grid-cols-3 gap-2">
            {materialList?.map((material) => (
              <Button
                key={material.id}
                type={selectedMaterial === material.id ? "primary" : "default"}
                onClick={() => {
                  setSelectedMaterial(material.id);
                  setSelectedThickness(null); // Reset thickness when material changes
                }}
                className={`h-auto py-2 text-left ${
                  selectedMaterial === material.id
                    ? ""
                    : "hover:border-blue-400"
                }`}
                block
              >
                <div className="flex items-start gap-2">
                  <img
                    className="w-5 h-5"
                    src={material.icon}
                    alt={material?.name}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {material.name}
                    </div>
                  </div>
                </div>
              </Button>
            ))}
          </div>
          {selectedMaterial && (
            <div className="mt-2 text-xs text-green-600 flex items-center gap-1">
              <CheckCircleOutlined />
              {materialList?.find((m) => m.id === selectedMaterial)?.name}{" "}
              selected
            </div>
          )}
        </div>

        {/* Thickness/Variant Selection - Show only if material is selected and has variants */}
        {selectedMaterial && availableVariants.length > 0 && (
          <div>
            <Divider style={{ margin: "8px 0" }} />
            <div className="text-sm font-medium mb-2">Select Thickness</div>
            <Radio.Group
              value={selectedThickness}
              onChange={(e) => setSelectedThickness(e.target.value)}
              className="w-full"
            >
              <div className="grid grid-cols-5 gap-2">
                {availableVariants
                  .filter((variant) => variant.is_active)
                  .map((variant) => (
                    <Radio.Button
                      key={variant.id}
                      value={variant.id}
                      className="text-center"
                      style={{ width: "100%" }}
                    >
                      <div>
                        <div className="font-medium">{variant.name}</div>
                        <div className="text-xs opacity-70">
                          €{parseFloat(variant.price * 10).toFixed(2)}/m²
                        </div>
                      </div>
                    </Radio.Button>
                  ))}
              </div>
            </Radio.Group>
          </div>
        )}

        <Divider style={{ margin: "8px 0" }} />

        {/* Color Selection */}
        <div>
          <div className="text-sm font-medium mb-2">Select Color</div>
          <div className="grid grid-cols-5 gap-2 mb-3">
            {standardColors.map((color) => (
              <div
                key={color.id}
                onClick={() => {
                  setSelectedColor(color.id);
                }}
                className={`
                  relative cursor-pointer rounded-lg p-1 transition-all
                  ${
                    selectedColor === color.id
                      ? "ring-2 ring-blue-500 ring-offset-2"
                      : "hover:ring-2 hover:ring-gray-300"
                  }
                `}
              >
                <div
                  className="w-full h-10 rounded-md border border-gray-300"
                  style={{ backgroundColor: color.hex }}
                />
                <div className="text-xs text-center mt-1 truncate">
                  {color.name}
                </div>
              </div>
            ))}
          </div>
        </div>

        <Divider style={{ margin: "8px 0" }} />

        {/* Finish Selection */}
        <div>
          <div className="text-sm font-medium mb-2">Select Finish</div>
          <Select
            value={selectedFinish}
            onChange={setSelectedFinish}
            placeholder="Choose a finish"
            style={{ width: "100%" }}
          >
            {finishOptions.map((finish) => (
              <Option key={finish.id} value={finish.id}>
                <div>
                  <span className="font-medium">{finish.name}</span>
                  <span className="text-gray-500 ml-2">
                    - {finish.description}
                  </span>
                </div>
              </Option>
            ))}
          </Select>
        </div>

        {/* Selection Summary */}
        {(selectedMaterial || selectedThickness || selectedColor) && (
          <>
            <Divider style={{ margin: "8px 0" }} />
            <div className="bg-green-50 p-3 rounded-lg">
              <div className="text-sm font-medium text-green-700 mb-2">
                Current Selection
              </div>
              <div className="space-y-1 text-sm">
                {selectedMaterial && (
                  <div>
                    Material:{" "}
                    <strong>
                      {
                        materialList?.find((m) => m.id === selectedMaterial)
                          ?.name
                      }
                    </strong>
                  </div>
                )}
                {selectedThickness && (
                  <div>
                    Thickness:{" "}
                    <strong>
                      {
                        availableVariants.find(
                          (v) => v.id === selectedThickness,
                        )?.name
                      }
                    </strong>
                  </div>
                )}
                {selectedColor && (
                  <div className="flex items-center gap-2">
                    Color:
                    <div
                      className="w-4 h-4 rounded border"
                      style={{
                        backgroundColor: standardColors.find(
                          (c) => c.id === selectedColor,
                        )?.hex,
                      }}
                    />
                    <strong>
                      {standardColors.find((c) => c.id === selectedColor)?.name}
                    </strong>
                  </div>
                )}
                {selectedFinish && (
                  <div>
                    Finish:{" "}
                    <strong>
                      {finishOptions.find((f) => f.id === selectedFinish)?.name}
                    </strong>
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </Space>
    </Card>
  );
}

export default MaterialSelector;
