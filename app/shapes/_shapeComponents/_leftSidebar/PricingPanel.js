"use client";
import { Card, Space, Divider, Alert, Tag } from "antd";
import { InfoCircleOutlined, CalculatorOutlined } from "@ant-design/icons";
import { useMemo } from "react";

// Pricing Configuration
const PRICING_CONFIG = {
  colorMultipliers: {
    white: 1.0,
    cream: 1.0,
    gray: 1.0,
    charcoal: 1.0,
    black: 1.0,
    brown: 1.0,
    navy: 1.0,
    green: 1.0,
    terracotta: 1.0,
    sand: 1.0,
  },
  complexShapeMultiplier: 1.2, // For shapes with more than 6 points
  radiusCornerCost: 5, // Per rounded corner
  drillingHoleCost: 3, // Per hole
  minimumOrderPrice: 10,
};

function PricingPanel({
  totalArea,
  drillingHoles,
  totalPerimeter,
  selectedMaterial,
  selectedThickness,
  selectedColor,
  selectedFinish,
  shapes,
  materialList,
}) {
  // Calculate pricing
  const pricing = useMemo(() => {
    let breakdown = [];
    let subtotal = 0;

    // Get material and thickness data
    const materialData = materialList?.find((m) => m.id === selectedMaterial);
    const thicknessData = materialData?.variants?.find(
      (v) => v.id === selectedThickness,
    );

    // Base price per sq m from thickness/variant
    const basePrice = parseFloat(thicknessData?.price || 0);
    const areaPrice = basePrice * totalArea;

    if (areaPrice > 0) {
      breakdown.push({
        item: `Base Material (${materialData?.name || "Not selected"})`,
        calculation: `${totalArea.toFixed(2)} sq m × €${basePrice}/sq m`,
        amount: areaPrice,
      });
      subtotal += areaPrice;
    }

    // Thickness info (already included in base price)
    if (selectedThickness && thicknessData) {
      breakdown.push({
        item: `Thickness (${thicknessData.name})`,
        calculation: `Included in base price`,
        amount: 0,
      });
    }

    // Color multiplier
    const colorMultiplier = PRICING_CONFIG.colorMultipliers[selectedColor] || 1;
    if (selectedColor && colorMultiplier !== 1) {
      const colorAdjustment = subtotal * (colorMultiplier - 1);
      breakdown.push({
        item: `Color Premium (${selectedColor})`,
        calculation: `${((colorMultiplier - 1) * 100).toFixed(0)}% premium`,
        amount: colorAdjustment,
      });
      subtotal += colorAdjustment;
    }

    // Complex shape multiplier
    const pointCount = shapes[0]?.points?.length || 0;
    if (pointCount > 6) {
      const complexityCharge =
        subtotal * (PRICING_CONFIG.complexShapeMultiplier - 1);
      breakdown.push({
        item: "Complex Shape",
        calculation: `${pointCount} vertices (20% surcharge)`,
        amount: complexityCharge,
      });
      subtotal += complexityCharge;
    }

    // Drilling holes
    const drillingCost = drillingHoles.length * PRICING_CONFIG.drillingHoleCost;
    if (drillingHoles.length > 0) {
      breakdown.push({
        item: "Drilling Holes",
        calculation: `${drillingHoles.length} holes × €${PRICING_CONFIG.drillingHoleCost}`,
        amount: drillingCost,
      });
      subtotal += drillingCost;
    }

    // Finish premium (optional - you can add pricing for finishes)
    if (selectedFinish) {
      // For now, finishes are free, but you can add pricing logic here
      breakdown.push({
        item: `Finish (${selectedFinish})`,
        calculation: `Included`,
        amount: 0,
      });
    }

    // Apply minimum order price
    const finalTotal = Math.max(subtotal, PRICING_CONFIG.minimumOrderPrice);
    const minimumApplied = subtotal < PRICING_CONFIG.minimumOrderPrice;

    return {
      breakdown,
      subtotal,
      finalTotal,
      minimumApplied,
    };
  }, [
    totalArea,
    selectedMaterial,
    selectedThickness,
    selectedColor,
    selectedFinish,
    shapes,
    drillingHoles,
    materialList,
  ]);

  // Get display names
  const materialData = materialList?.find((m) => m.id === selectedMaterial);
  const thicknessData = materialData?.variants?.find(
    (v) => v.id === selectedThickness,
  );

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalculatorOutlined />
          <span>Pricing Estimate</span>
        </div>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        {/* Area & Perimeter Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-xs text-blue-600">Total Area</div>
            <div className="text-xl font-bold text-blue-700">
              {totalArea.toFixed(2)}
            </div>
            <div className="text-xs text-blue-500">sq m</div>
          </div>
          {/* <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-xs text-green-600">Perimeter</div>
            <div className="text-xl font-bold text-green-700">
              {totalPerimeter.toFixed(2)}
            </div>
            <div className="text-xs text-green-500">ft</div>
          </div> */}
        </div>

        <Divider style={{ margin: "12px 0" }}>Price Breakdown</Divider>

        {/* Price Breakdown */}
        <div className="space-y-2">
          {pricing.breakdown.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center py-1 border-b border-gray-100 last:border-0"
            >
              <div>
                <div className="text-sm">{item.item}</div>
                <div className="text-xs text-gray-500">{item.calculation}</div>
              </div>
              <div className="font-medium">
                {item.amount > 0 ? `€${item.amount.toFixed(2)}` : "-"}
              </div>
            </div>
          ))}
        </div>

        {/* Subtotal */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Subtotal</span>
            <span className="font-medium">€{pricing.subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Minimum Order Notice */}
        {pricing.minimumApplied && (
          <Alert
            type="info"
            title={`Minimum order price of €${PRICING_CONFIG.minimumOrderPrice} applied`}
            showIcon
          />
        )}

        {/* Final Total */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90">Estimated Total</div>
              <div className="text-xs opacity-75">VAT not included</div>
            </div>
            <div className="text-3xl font-bold">
              €{pricing.finalTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Price Disclaimer */}
        <Alert
          type="warning"
          title="Pricing Note"
          description={
            <div className="text-xs">
              <p>
                This is an <strong>estimated price</strong>. Final pricing may
                vary based on:
              </p>
              <ul className="list-disc ml-4 mt-1">
                <li>Exact material availability</li>
                <li>Shape complexity verification</li>
                <li>Special color matching</li>
                <li>Current market rates</li>
              </ul>
              <p className="mt-1">
                You will receive a confirmed quote after order review.
              </p>
            </div>
          }
          showIcon
          icon={<InfoCircleOutlined />}
        />

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {materialData && <Tag color="blue">{materialData.name}</Tag>}
          {thicknessData && <Tag color="green">{thicknessData.name}</Tag>}
          {selectedColor && <Tag color="purple">{selectedColor}</Tag>}
          {selectedFinish && <Tag color="orange">{selectedFinish}</Tag>}
        </div>
      </Space>
    </Card>
  );
}

export default PricingPanel;
