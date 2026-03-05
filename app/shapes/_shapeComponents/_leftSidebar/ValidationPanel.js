"use client";
import {
  Card,
  Button,
  Space,
  Alert,
  List,
  Badge,
  Progress,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  ReloadOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import React from "react";

function ValidationPanel({ lang, validationErrors, validateOrder }) {
  const isValid = validationErrors.length === 0;

  const isEn = lang === "en";

  // Run validation
  const handleValidate = () => {
    const isValid = validateOrder();
    if (isValid) {
      message.success(
        isEn
          ? "All validations passed! Ready to submit."
          : "Alle validaties geslaagd! Klaar om te verzenden.",
      );
    } else {
      message.error(
        isEn
          ? `Found ${validationErrors.length} issue(s). Please fix before submitting.`
          : `${validationErrors.length} probleem(en) gevonden. Los deze op voordat je verzendt.`,
      );
    }
  };

  // Validation checklist
  const validationChecklist = [
    {
      key: "shape",
      title: isEn ? "Shape Defined" : "Vorm Gedefinieerd",
      description: isEn
        ? "At least one shape must be created or uploaded"
        : "Er moet minimaal één vorm worden gemaakt of geüpload",
      check: () => !validationErrors.some((e) => e.includes("shape")),
    },
    {
      key: "holes",
      title: isEn ? "Drilling Holes (min. 2)" : "Boor Gaten (min. 2)",
      description: isEn
        ? "Minimum 2 drilling holes required for mounting"
        : "Minimaal 2 boorgaten nodig voor montage",
      check: () => !validationErrors.some((e) => e.includes("drilling")),
    },
    {
      key: "material",
      title: isEn ? "Material Selected" : "Materiaal Geselecteerd",
      description: isEn ? "Choose a material type" : "Kies een materiaaltype",
      check: () => !validationErrors.some((e) => e.includes("material")),
    },
    {
      key: "thickness",
      title: isEn ? "Thickness Selected" : "Dikte Geselecteerd",
      description: isEn ? "Choose material thickness" : "Kies materiaaldikte",
      check: () => !validationErrors.some((e) => e.includes("thickness")),
    },
    {
      key: "color",
      title: isEn ? "Color Selected" : "Kleur Geselecteerd",
      description: isEn
        ? "Choose a standard color or request special color"
        : "Kies een standaardkleur of vraag een speciale kleur aan",
      check: () => !validationErrors.some((e) => e.includes("color")),
    },
  ];

  const passedCount = validationChecklist.filter((item) => item.check()).length;
  const progressPercent = Math.round(
    (passedCount / validationChecklist.length) * 100,
  );

  return (
    <Card
      title={
        <div className="flex items-center gap-2">
          <SafetyCertificateOutlined />
          <span>{isEn ? "Order Validation" : "Bestelling Validatie"}</span>
          <Badge
            count={isValid ? "✓" : validationErrors.length}
            style={{ backgroundColor: isValid ? "#52c41a" : "#ff4d4f" }}
          />
        </div>
      }
      size="small"
      className="shadow-md"
    >
      <Space orientation="vertical" className="w-full" size="small">
        {/* Progress */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">
              {isEn ? "Completion Progress" : "Voortgang"}
            </span>
            <span className="text-sm text-gray-500">
              {passedCount}/{validationChecklist.length}
            </span>
          </div>
          <Progress
            percent={progressPercent}
            status={isValid ? "success" : "active"}
            strokeColor={isValid ? "#52c41a" : "#1890ff"}
          />
        </div>

        {/* Validation Checklist */}
        <div className="space-y-2">
          {validationChecklist.map((item) => {
            const passed = item.check();
            return (
              <div
                key={item.key}
                className={`p-3 rounded-lg border transition-all ${
                  passed
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2">
                  {passed ? (
                    <CheckCircleOutlined className="text-green-500 text-lg" />
                  ) : (
                    <CloseCircleOutlined className="text-red-500 text-lg" />
                  )}
                  <div className="flex-1">
                    <div
                      className={`font-medium text-sm ${passed ? "text-green-700" : "text-red-700"}`}
                    >
                      {item.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {item.description}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error Details */}
        {validationErrors.length > 0 && (
          <>
            <Alert
              type="error"
              title={
                isEn
                  ? `${validationErrors.length} Issue(s) Found`
                  : `${validationErrors.length} probleem(en) gevonden`
              }
              description={
                <ul className="list-disc ml-4 mt-2 space-y-1">
                  {validationErrors.map((error, idx) => (
                    <li key={idx} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              }
              showIcon
              icon={<WarningOutlined />}
            />
          </>
        )}

        {/* Success Message */}
        {isValid && (
          <Alert
            type="success"
            title={
              isEn
                ? "All Validations Passed!"
                : "Alle validaties zijn geslaagd!"
            }
            description={
              isEn
                ? "Your order is ready to be submitted. Click 'Submit Order' to proceed."
                : "Je bestelling is klaar om te verzenden. Klik op 'Bestelling verzenden' om verder te gaan."
            }
            showIcon
            icon={<CheckCircleOutlined />}
          />
        )}

        {/* Validate Button */}
        <Button
          type={isValid ? "default" : "primary"}
          icon={<ReloadOutlined />}
          onClick={handleValidate}
          block
          size="large"
        >
          {isValid
            ? isEn
              ? "Re-validate"
              : "Opnieuw valideren"
            : isEn
              ? "Run Validation"
              : "Validatie uitvoeren"}
        </Button>

        {/* QA Notes */}
        <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
          <div className="text-sm font-medium text-amber-700 mb-1">
            ⚠️ {isEn ? "Quality Assurance" : "Kwaliteitscontrole"}
          </div>
          <ul className="text-xs text-amber-600 space-y-1 list-disc ml-4">
            <li>
              {isEn
                ? "All shapes will be reviewed by our team"
                : "Alle vormen worden door ons team gecontroleerd"}
            </li>
            <li>
              {isEn
                ? "Complex shapes may require additional verification"
                : "Complexe vormen kunnen extra verificatie vereisen"}
            </li>
            <li>
              {isEn
                ? "Radius intersections are automatically checked"
                : "Straal-snijdingen worden automatisch gecontroleerd"}
            </li>
            <li>
              {isEn
                ? "Minimum hole distance from edges is validated"
                : "Minimale afstand van gaten tot randen wordt gecontroleerd"}
            </li>
          </ul>
        </div>

        {/* Production Info */}
        <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-700 mb-1">
            📋 {isEn ? "Next Steps" : "Volgende Stappen"}
          </div>
          <ol className="text-xs text-blue-600 space-y-1 list-decimal ml-4">
            <li>{isEn ? "Submit your order" : "Dien je bestelling in"}</li>
            <li>
              {isEn
                ? "Receive confirmation email"
                : "Ontvang een bevestigingsmail"}
            </li>
            <li>
              {isEn
                ? "Our team reviews your design"
                : "Ons team beoordeelt je ontwerp"}
            </li>
            <li>
              {isEn
                ? "Final quote sent within 24-48 hours"
                : "Definitieve offerte binnen 24-48 uur"}
            </li>
            <li>
              {isEn
                ? "Production begins after approval"
                : "Productie start na goedkeuring"}
            </li>
          </ol>
        </div>
      </Space>
    </Card>
  );
}

export default ValidationPanel;
