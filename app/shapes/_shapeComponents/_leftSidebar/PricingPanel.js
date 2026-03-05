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
  complexShapeMultiplier: 1.0,
  radiusCornerCost: 5,
  drillingHoleCost: 1.5,
  minimumOrderPrice: 5,
};

function PricingPanel({
  lang,
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
  const isEn = lang === "en";

  // Calculate pricing
  const pricing = useMemo(() => {
    let breakdown = [];
    let subtotal = 0;

    const materialData = materialList?.find((m) => m.id === selectedMaterial);
    const thicknessData = materialData?.variants?.find(
      (v) => v.id === selectedThickness,
    );

    const basePrice = parseFloat(thicknessData?.price || 0) * 10;

    const areaPrice = basePrice * totalArea;

    if (areaPrice > 0) {
      breakdown.push({
        item: isEn
          ? `Base Material (${materialData?.name || "Not selected"})`
          : `Basismateriaal (${materialData?.name || "Niet geselecteerd"})`,
        calculation: `${totalArea.toFixed(2)} ${isEn ? "sq m" : "m²"} × €${basePrice}/${isEn ? "sq m" : "m²"}`,
        amount: areaPrice,
      });
      subtotal += areaPrice;
    }

    if (selectedThickness && thicknessData) {
      breakdown.push({
        item: isEn
          ? `Thickness (${thicknessData.name})`
          : `Dikte (${thicknessData.name})`,
        calculation: isEn
          ? `Included in base price`
          : `Inbegrepen in basisprijs`,
        amount: 0,
      });
    }

    const colorMultiplier = PRICING_CONFIG.colorMultipliers[selectedColor] || 1;
    if (selectedColor && colorMultiplier !== 1) {
      const colorAdjustment = subtotal * (colorMultiplier - 1);
      breakdown.push({
        item: isEn
          ? `Color Premium (${selectedColor})`
          : `Kleurtoeslag (${selectedColor})`,
        calculation: `${((colorMultiplier - 1) * 100).toFixed(0)}% ${
          isEn ? "premium" : "toeslag"
        }`,
        amount: colorAdjustment,
      });
      subtotal += colorAdjustment;
    }

    const pointCount = shapes[0]?.points?.length || 0;
    if (pointCount > 6) {
      const complexityCharge =
        subtotal * (PRICING_CONFIG.complexShapeMultiplier - 1);
      breakdown.push({
        item: isEn ? "Complex Shape" : "Complexe Vorm",
        calculation: `${pointCount} ${
          isEn ? "vertices (20% surcharge)" : "hoekpunten (20% toeslag)"
        }`,
        amount: complexityCharge,
      });
      subtotal += complexityCharge;
    }

    const drillingCost = drillingHoles.length * PRICING_CONFIG.drillingHoleCost;
    if (drillingHoles.length > 0) {
      breakdown.push({
        item: isEn ? "Drilling Holes" : "Boor Gaten",
        calculation: `${drillingHoles.length} ${
          isEn ? "holes" : "gaten"
        } × €${PRICING_CONFIG.drillingHoleCost}`,
        amount: drillingCost,
      });
      subtotal += drillingCost;
    }

    if (selectedFinish) {
      breakdown.push({
        item: isEn
          ? `Finish (${selectedFinish})`
          : `Afwerking (${selectedFinish})`,
        calculation: isEn ? `Included` : `Inbegrepen`,
        amount: 0,
      });
    }

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

  const materialData = materialList?.find((m) => m.id === selectedMaterial);
  const thicknessData = materialData?.variants?.find(
    (v) => v.id === selectedThickness,
  );

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <CalculatorOutlined />
          <span>{isEn ? "Pricing Estimate" : "Prijs Schatting"}</span>
        </div>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        {/* Area Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-xs text-blue-600">
              {isEn ? "Total Area" : "Totale Oppervlakte"}
            </div>
            <div className="text-xl font-bold text-blue-700">
              {totalArea.toFixed(2)}
            </div>
            <div className="text-xs text-blue-500">{isEn ? "sq m" : "m²"}</div>
          </div>
        </div>

        <Divider style={{ margin: "12px 0" }}>
          {isEn ? "Price Breakdown" : "Prijs Specificatie"}
        </Divider>

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
            <span className="text-gray-600">
              {isEn ? "Subtotal" : "Subtotaal"}
            </span>
            <span className="font-medium">€{pricing.subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Minimum Order Notice */}
        {pricing.minimumApplied && (
          <Alert
            type="info"
            title={
              isEn
                ? `Minimum order price of €${PRICING_CONFIG.minimumOrderPrice} applied`
                : `Minimale bestelprijs van €${PRICING_CONFIG.minimumOrderPrice} toegepast`
            }
            showIcon
          />
        )}

        {/* Final Total */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm opacity-90">
                {isEn ? "Estimated Total" : "Geschat Totaal"}
              </div>
              <div className="text-xs opacity-75">
                {isEn ? "VAT not included" : "BTW niet inbegrepen"}
              </div>
            </div>
            <div className="text-3xl font-bold">
              €{pricing.finalTotal.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Price Disclaimer */}
        <Alert
          type="warning"
          title={isEn ? "Pricing Note" : "Prijs Opmerking"}
          description={
            <div className="text-xs">
              <p>
                {isEn ? "This is an " : "Dit is een "}
                <strong>{isEn ? "estimated price" : "geschatte prijs"}</strong>.
                {isEn
                  ? " Final pricing may vary based on:"
                  : " De uiteindelijke prijs kan variëren op basis van:"}
              </p>
              <ul className="list-disc ml-4 mt-1">
                <li>
                  {isEn
                    ? "Exact material availability"
                    : "Exacte beschikbaarheid van materiaal"}
                </li>
                <li>
                  {isEn
                    ? "Shape complexity verification"
                    : "Controle van vormcomplexiteit"}
                </li>
                <li>
                  {isEn ? "Special color matching" : "Speciale kleurafstemming"}
                </li>
                <li>
                  {isEn ? "Current market rates" : "Huidige marktprijzen"}
                </li>
              </ul>
              <p className="mt-1">
                {isEn
                  ? "You will receive a confirmed quote after order review."
                  : "Je ontvangt een definitieve offerte na beoordeling van de bestelling."}
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
