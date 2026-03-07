"use client";
import { Modal, Button, Divider, Tag, Alert, Space } from "antd";
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";

function OrderConfirmation({
  lang,
  showValidationModal,
  setShowValidationModal,
  totalArea,
  totalPerimeter,
  drillingHoles,
  selectedMaterial,
  selectedThickness,
  selectedColor,
  selectedFinish,
  materialList,
  handleSubmitOrder,
  validationErrors,
}) {
  const isEn = lang === "en";

  const t = {
    validationFailed: isEn
      ? "Order Validation Failed"
      : "Ordervalidatie mislukt",
    reviewOrder: isEn ? "Review Your Order" : "Controleer uw bestelling",
    cancel: isEn ? "Cancel" : "Annuleren",
    fixErrors: isEn ? "Fix Errors First" : "Los eerst fouten op",
    confirmOrder: isEn ? "Confirm Order" : "Bestelling bevestigen",
    fixFollowing: isEn
      ? "Please fix the following errors:"
      : "Los de volgende fouten op:",
    orderSummary: isEn ? "Order Summary" : "Besteloverzicht",
    totalArea: isEn ? "Total Area:" : "Totaal oppervlak:",
    // totalPerimeter: isEn ? "Total Perimeter:" : "Totale omtrek:",
    drillingHoles: isEn ? "Drilling Holes:" : "Boorgaten:",
    materialSelection: isEn ? "Material Selection" : "Materiaalselectie",
    material: isEn ? "Material:" : "Materiaal:",
    thickness: isEn ? "Thickness:" : "Dikte:",
    color: isEn ? "Color:" : "Kleur:",
    finish: isEn ? "Finish:" : "Afwerking:",
    notSelected: isEn ? "Not selected" : "Niet geselecteerd",
    estimatedTotal: isEn ? "Estimated Total" : "Geschat totaal",
    vatNotIncluded: isEn ? "(VAT not included)" : "(BTW niet inbegrepen)",
    importantNotes: isEn ? "Important Notes" : "Belangrijke opmerkingen",
    note1: isEn ? "This is an estimated price" : "Dit is een geschatte prijs",
    note2: isEn
      ? "Final price will be confirmed after review"
      : "De definitieve prijs wordt bevestigd na beoordeling",
    note3: isEn ? "Production time: 3-4 weeks" : "Productietijd: 3-4 weken",
    note4: isEn
      ? "All measurements are in feet unless specified"
      : "Alle afmetingen zijn in voet tenzij anders aangegeven",
  };

  // Get material and thickness data
  const materialData = materialList?.find((m) => m.id === selectedMaterial);
  const thicknessData = materialData?.variants?.find(
    (v) => v.id === selectedThickness,
  );

  // Calculate estimated price
  const basePrice = parseFloat(thicknessData?.price || 0);
  const estimatedPrice = Math.max(basePrice * totalArea, 10);

  const hasErrors = validationErrors && validationErrors.length > 0;

  return (
    <Modal
      title={
        <div className="flex items-center gap-2">
          {hasErrors ? (
            <>
              <WarningOutlined className="text-red-500" />
              <span>{t.validationFailed}</span>
            </>
          ) : (
            <>
              <CheckCircleOutlined className="text-green-500" />
              <span>{t.reviewOrder}</span>
            </>
          )}
        </div>
      }
      open={showValidationModal}
      onCancel={() => setShowValidationModal(false)}
      width={600}
      footer={[
        <Button key="cancel" onClick={() => setShowValidationModal(false)}>
          {t.cancel}
        </Button>,
        <Button
          key="submit"
          type="primary"
          onClick={handleSubmitOrder}
          disabled={hasErrors}
        >
          {hasErrors ? t.fixErrors : t.confirmOrder}
        </Button>,
      ]}
    >
      <Space orientation="vertical" className="w-full" size="middle">
        {/* Validation Errors */}
        {hasErrors && (
          <Alert
            type="error"
            message={t.fixFollowing}
            description={
              <ul className="list-disc ml-4 mt-2">
                {validationErrors.map((error, idx) => (
                  <li key={idx}>{error}</li>
                ))}
              </ul>
            }
            showIcon
            icon={<CloseCircleOutlined />}
          />
        )}

        {!hasErrors && (
          <>
            {/* Order Summary */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm font-medium text-blue-700 mb-3">
                {t.orderSummary}
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.totalArea}</span>
                  <span className="font-medium">
                    {totalArea.toFixed(2)} sq m
                  </span>
                </div>
                {/* <div className="flex justify-between">
                  <span className="text-gray-600">Total Perimeter:</span>
                  <span className="font-medium">
                    {totalPerimeter.toFixed(2)} ft
                  </span>
                </div> */}
                <div className="flex justify-between">
                  <span className="text-gray-600">{t.drillingHoles}</span>
                  <span className="font-medium">{drillingHoles.length}</span>
                </div>
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Material Selection */}
            <div>
              <div className="text-sm font-medium mb-2">
                {t.materialSelection}
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{t.material}</span>
                  <Tag color="blue">{materialData?.name || t.notSelected}</Tag>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{t.thickness}</span>
                  <Tag color="green">
                    {thicknessData?.name || t.notSelected}
                  </Tag>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{t.color}</span>
                  <Tag color="purple">{selectedColor || t.notSelected}</Tag>
                </div>
                {selectedFinish && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">{t.finish}</span>
                    <Tag color="orange">{selectedFinish}</Tag>
                  </div>
                )}
              </div>
            </div>

            <Divider style={{ margin: "12px 0" }} />

            {/* Estimated Price */}
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 rounded-lg text-white">
              <div className="flex justify-between items-center">
                <div>
                  <div className="text-sm opacity-90">{t.estimatedTotal}</div>
                  <div className="text-xs opacity-75">{t.vatNotIncluded}</div>
                </div>
                <div className="text-3xl font-bold">
                  €{estimatedPrice.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Important Notes */}
            <Alert
              type="info"
              message={t.importantNotes}
              description={
                <ul className="list-disc ml-4 text-xs">
                  <li>{t.note1}</li>
                  <li>{t.note2}</li>
                  <li>{t.note3}</li>
                  <li>{t.note4}</li>
                </ul>
              }
              showIcon
            />
          </>
        )}
      </Space>
    </Modal>
  );
}

export default OrderConfirmation;
